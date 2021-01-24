// 之所以研究这个，是因为vue的next-tick实现和这个的形势基本一样

;(function (global) {
	if (global.setImmediate) return

	// 回调函数的全局序号
	let nextHandler = 1

	const tasksByHandle = {}
	let currentlyRunningATask = false

	const doc = document

	let registerImmediate // 后面的代码会对这个变量进行复写

	function setImmediate(cb, ...args) {
		// 回调可以是字符串
		if (typeof cb !== 'function') cb = new Function('', cb)

		const task = { cb, args }

		tasksByHandle[nextHandler] = task

		// 作为中间方传递回调序号
		registerImmediate(nextHandler)

		return nextHandler++
	}

	function clearImmediate(handler) {
		delete tasksByHandle[handler]
	}

	function run(task) {
		const { cb, args } = task

		cb.apply(null, args)
	}

	// 再做一层中转，用来防止连续的调用
	function runIfPresent(handler) {
		if (currentlyRunningATask) {
			setTimeout(runIfPresent, 0, handler)
		} else {
			const task = tasksByHandle[handler]
			if (task) {
				currentlyRunningATask = true
				try {
					run(task)
				} finally {
					clearImmediate(handler)
					currentlyRunningATask = false
				}
			}
		}
	}

	// 为node准备
	function installNextTickImplementation() {
		registerImmediate = handler => process.nextTick(() => runIfPresent(handler))
	}

	function canUsePostMessage() {
		// 第二个条件是为了排除掉web worker环境
		// The test against `importScripts` prevents this implementation from being installed inside a web worker,
		// where `global.postMessage` means something completely different and can't be used for this purpose.
		if (global.postMessage && !global.importScripts) {
			let postMessageIsAsynchronous = true

			// 一般情况下，postMessage是异步的，但在ie8是同步的
			const oldOnMessage = global.onmessage
			global.onmessage = () => (postMessageIsAsynchronous = false)
			global.postMessage('', '*')
			global.onmessage = oldOnMessage

			return postMessageIsAsynchronous
		}
	}

	function installPostMessageImplementation() {
		const messagePrefix = `setImmediate$${Math.random()}$`

		const onGlobalMessage = e => {
			const { source, data } = e
			if (
				(source === global && typeof data =
					'string' && data.indexOf(messagePrefix) === 0)
			) {
				runIfPresent(+data.slice(messagePrefix.length))
			}
		}

		if (global.addEventListener) {
			global.addEventListener('message', onGlobalMessage)
		} else {
			// ie环境
			global.attachEvent('onmessage', onGlobalMessage)
		}

		registerImmediate = handler =>
			global.postMessage(messagePrefix + handler, '*')
	}

	function installMessageChannelImplementation() {
		const channel = new MessageChannel()
		channel.port1.onmessage = e => {
			const handler = e.data
			runIfPresent(handler)
		}

		// handler只是一个回调的序号，所以可以传，如果是一个函数，则会受到结构化克隆的限制
		registerImmediate = handler => channel.port2.postMessage(handler)
	}

	function installReadyStateChangeImplementation() {
		const html = doc.documentElement

		registerImmediate = handler => {
			let script = doc.createElement('script')

			script.onreadystatechange = () => {
				runIfPresent(handler)
				script.onreadystatechange = null
				html.removeChild(script)
				script = null
			}

			html.appendChild(script)
		}
	}

	function installSetTimeoutImplementation() {
		registerImmediate = handler => {
			setTimeout(runIfPresent, 0, handle)
		}
	}

	// 将此方法挂载到和setTimeout一样的对象上，暂时不知道为什么要这样？
	let attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global)
	attachTo = attachTo && attachTo.setTimeout ? attachTo : global

	// node环境
	if ({}.toString.call(global.process) === '[object process]') {
		installNextTickImplementation()
	} else if (canUsePostMessage()) {
		// postMessage比setTimeout要早
		installPostMessageImplementation()
	} else if (global.MessageChannel) {
		installMessageChannelImplementation()
	} else if (doc && 'onreadystatechange' in doc.createElement('script')) {
		installReadyStateChangeImplementation()
	} else {
		installSetTimeoutImplementation()
	}

	attachTo.setImmediate = setImmediate
	attachTo.clearImmediate = clearImmediate
})(
	typeof self === undefined
		? typeof global === undefined
			? this
			: global
		: self
)
