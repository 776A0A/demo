function addLoadEvent(func) {
	var oldLoad = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function () {
			oldLoad();
			func();
		}
	}
}

for (var i = 0; i < 5; i++) {
	(function (i) {
		setTimeout(function () {
			console.log(i)
		}, i * 1000)
	})(i)
}

for (let i = 0; i < 5; i++) {
	setTimeout(() => {
		console.log(i)
	}, i * 1000)
}

function a(params) {
	var i;
	return function () {
		return params[i++];
	}
}

var a = ! function () { }()

window.addEventListener('message', (e) => {
	console.log(e)
})


let a = 1;
switch (a) {
	case 1:
		a = 2;
		break;
	case 2:
		a = 3;
		break;
	default:
		a = 4;
		break;
}

let args = [].slice.call(arguments);
let args = Array.prototype.call(arguments);
let args = Array.from(arguments);
let args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
let args = [...arguments];

Math.min(Math.max(1, input), 12)

let s = [0, 0, 0, 0, 0, 0, 0];
for (var i = 2019; i < 3019; i++) {
	s[new Date(i, 3, 24).getDay()]++
}

function extend(c, p) {
	let F = function () { };
	F.prototype = p.prototype;
	c.prototype = new F();
	c.prototype.constructor = c;
	c.prototype.uber = p.prototype;
}

function extendCopy(o) {
	var c = {};
	for (let i in o) {
		c[i] = o[i];
	}
	c.uber = o;
	return c;
}

function deepCopy(p, c) {
	let c = c || {};
	for (let i in p) {
		if (p.hasOwnProperty(i)) {
			if (typeof p[i] === 'object') {
				c[i] = Array.isArray(p[i]) ? [] : {};
				deepCopy(p[i], c[i])
			} else {
				c[i] = p[i];
			}
		}
	}
	return c;
}


function multi() {
	let n = {};
	for (let i = 0; i < arguments.length; i++) {
		let stuff = arguments[i];
		for (let j in stuff) {
			if (stuff.hasOwnProperty(j)) {
				n[j] = stuff[j];
			}
		}
	}
	return n;
}

parentNode, childNodes, firstChild, lastChild, nextSibling, previousSibling

function walkDON(n) {
	do {
		console.log(n)
		if (n.hasChildNodes()) {
			walkDON(n.firstChild)
		}
	} while (n = n.nextSibling)
}

let a = ['a', 'b', 'c'];
for (let i in a) {
	console.log(i, a[i])
}

function doAction(act) {
	let actions = {
		hack() {
			return 'hack';
		},
		slash() {
			return 'slash';
		},
		run() {
			return 'run';
		}
	}
	if (typeof actions[act] !== 'function') {
		throw new Error('Invalid action')
	}
	return actions[act]();
}

let data = [1, 2, 3, , 4, 5];
let list = document.createDocumentFragment();
data.forEach((item) => {
	let li = document.createElement('li');
	li.innerHTML = item;
	list.appendChild(li)
})
document.getELementById('list').appendChild(list)

document.getELementById('list').addEventListener('click', (e) => {
	if (e.target.nodeName === 'LI') {
		console.log('you got me!')
	}
})

let data = [{
	username: 'zhang',
	age: 23
},
{
	username: 'wang',
	age: 25
},
{
	username: 'liu',
	age: 18
}
];
let userStore = {};
data.forEach((item) => {
	userStore[item.username] = item;
})

let obj1 = JSON.parse(JSON.stringify(obj));

Array.prototype.shuffle = function () {
	return this.sort(() => {
		return Math.random() - .5;
	})
}

function getRGB(hex) {
	let res = [];
	for (let i = 0; i < 3; i++) {
		res.push(parseInt('' + hex[i * 2 + 1] + hex[i * 2 + 2], 16))
	}
	return 'rgb(' + res.join(',') + ')';
}

window.jQuery = function (ns) {
	let nodes = {};
	if (typeof ns === 'string') {
		let temp = document.querySelectorAll(ns);
		for (let i = 0; i < temp.length; i++) {
			nodes[i] = temps[i];
			nodes.length = temps.length;
		}
	} else if (ns instanceof Node) {
		nodes = {
			0: ns,
			length: 1
		}
	}

	nodes.addClass = function (c) {
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].classList.add(c)
		}
	}
	nodes.setText = function (t) {
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].textContent = t;
		}
	}

	return nodes;
}


function makeIterator(array) {
	let nextIndex = 0;
	return {
		next() {
			return nextIndex < array.length ? {
				value: array[nextIndex++],
				done: flase
			} : {
					value: undefined,
					done: true
				}
		}
	}
}

let obj = {
	data: ['hello', 'world'],
	[Symbol.iterator]() {
		const self = this;
		let index = 0;
		return {
			next() {
				if (index < self.data.length) {
					return {
						value: self.data[index++],
						done: false
					}
				} else {
					return {
						value: undefined,
						done: true

					}
				}
			}
		}
	}
}

let obj = {
	*[Symbol.iterator]() {
		yield 'hello';
		yield 'world'
		yield this.a;
	},
	a: '!!!'
}

const arr = ['red', 'green', 'blue'];
const obj = {
	[Symbol.iterator]: arr[Symbol.iterator].bind(arr)
}

let s = new Set()[2, 3, 4, 1, 1, 43, 4].forEach(x => {
	s.add(x)
})

function parent() {

}

function child() {
	parent.apply(this, arguments);
}
child.prototype = new parent();
child.prototype.constructor = child;
let c = new child()

function deepCopy(c = {}, p = {}) {
	for (let i in p) {
		if (p.hasOwnProperty(i)) {
			if (typeof p[i] === 'object') {
				c[i] = Array.isArray(p[i]) ? [] : {};
				deepCopy(c[i], p[i])
			} else {
				c[i] = p[i];
			}
		}
	}
	return c;
}

function prototype(childFn, parentFn) {
	// 相当于一个中转站
	let obj = Object.create(parentFn.prototype);
	obj.constructor = childFn;
	// 通过new childFn创造的对象可以连接到parentFn的原型属性和方法，
	// 但不会继承parentFn内的私有属性
	childFn.prototype = obj;
}

// 模拟instanceof
function instanceOf(l, r) {
	let proto = r.prototype;
	l = l.__proto__;
	while (true) {
		if (l === null) return false;
		if (l === proto) return true;
		l = l.__proto__;
	}
}

function temp() {
	console.log(arguments)
}


function binary(arr, value) {
	let l = 0,
		h = arr.length - 1,
		mid = parseInt((l + h) / 2);
	while (l <= h) {
		if (value < arr[mid]) {
			return mid;
		} else if (value < arr[mid]) {
			h = mid + 1;
		} else if (value > arr[mid]) {
			l = mid - 1;
		} else {
			return -1;
		}
	}
}

let xhr = new XMLHttpRequest();
xhr.open('GET', url, true)
xhr.setRequestHeader('Content-Type', 'x-www-form-urlencoded')
xhr.setRequestHeader('Content-Length', JSON.stringify(data).length)
xhr.responseType = 'document';
xhr.withCredentials = true;
xhr.onreadystatechange = () => {
	if (xhr.readyState === 4) {
		if (xhr.status >= 200 && xhr.status < 400) {
			console.log(JSON.parse(xhr.resopnseText))
		} else if (xhr.status > 400) {
			console.log('Error')
		}
	}
}
xhr.send(null)


function myAJAX(url, method, data = {}, async = true) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url, async)
		xhr.setRequestHeader('Content-Type', 'x-www-from-urlencoded')
		xhr.responseType = 'document';
		xhr.withCredentials = true;
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText))
				} else if (xhr.status >= 400) {
					reject(JSON.parse(xhr.statusText))
				}
			}
		}
		xhr.send(JSON.stringify(data))
	})
}

function xxx(arr) {
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		if (res.indexOf(arr[i]) === -1) {
			res.push(arr[i])
		}
	}
	return res;
}

function xxxx(arr) {
	let obj = {},
		res = [];
	for (let i = 0; i < arr.length; i++) {
		if (!obj[arr[i]]) {
			obj[arr[i]] = true;
			res.push(arr[i])
		}
	}
	return res;
}

window.JQuery = (function (nodeOrSelector) {
	let obj = {}
	if (typeof nodeOrSelector === 'string') {
		let temp = document.querySelectorAll(nodeOrSelector);
		for (let i = 0; i < temp.length; i++) {
			obj[i] = temp[i];
			obj.length = temp.length;
		}
	} else if (nodeOrSelector instanceof Node) {
		obj = {
			0: nodeOrSelector,
			length: 1
		}
	}
})();

[...new Set([...arr, ...arr2])].sort((a, b) => {
	return a - b;
})

function saferHTML(temp) {
	let str = temp[0];
	for (let i = 1; i < arguments.length; i++) {
		let arg = String(arguments[i]);
		str += arg.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		str += arguments[i];
	}
	return str;
}

function _new(fn) {
	let obj = {};
	let args = [...arguments].slice(1);
	let res = fn.apply(obj, args);
	return res instanceof Object ? res : obj;
}

Function.prototype._call = function (context) {
	context.fn = this;
	let args = [...arguments].slice(1);
	let res = context.fn(...args);
	delete context.fn;
	return res;
}

Function.prototype._bind = function (context) {
	let thisFn = this;
	let args = [...arguments].slice(1);
	let fnBound = function () {
		return thisFn.apply(this instanceof FnBound ? this : context, [...args, ...arguments]);
	}
	fnBound.prototype = thisFn.prototype;
	return fnBound;
}

function _binarySearch(arr, value) {
	let low = 0,
		high = arr.length - 1,
		mid = parseInt((low + high) / 2);
	while (true) {
		if (value === arr[mid]) {
			return mid;
		} else if (value > arr[mid]) {
			low = mid - 1;
		} else if (value < arr[mid]) {
			high = mid + 1;
		} else {
			return -1;
		}
	}
}

(function (global) {
	Object.defineProperty(Number, 'isSafeInteger', {
		value(value) {
			return typeof value === 'number' &&
				Math.round(value) === value &&
				value <= Number.MAX_SAFE_INTEGER &&
				value >= Number.MIN_SAFE_INTEGER;
		},
		configurable: true,
		enumerable: false,
		writable: true
	})
})(this);

Math.trunc = Math.trunc || function (x) {
	return x < 0 ? Math.ceil(x) : Math.floor(x);
}

	(function (global) {
		Object.defineProperty(Number, 'isSafeInteger', {
			value(value) {
				return typeof value === 'numver' &&
					Math.round(value) === value &&
					value <= Number.MAX_SAFE_INTEGER &&
					value >= Number.MIN_SAFE_INTEGER;
			},
			configurable: true,
			enumerable: false,
			writable: true
		})
	})(this);


function currying(fn, n) {
	return function (m) {
		return fn.call(this, m, n)
	}
}

function trampoline(f) {
	while (f && f instanceof Function) {
		f = f()
	}
	return f;
}

function tco(f) {
	let value,
		active = false,
		accumulated = [];

	return function accumulator() {
		accumulated.push(arguments)
		if (!active) {
			active = true;
			while (accumulated.length) {
				value = f.apply(this, accumulated.shift());
			}
			active = false;
			return value;
		}
	};
}

let sum = tco((x, y) => {
	if (y > 0) {
		return sum(x + 1, y - 1)
	} else {
		return x;
	}
})

function getElementTop(elem) {
	let top = elem.offsetTop;
	let currentParent = elem.offsetParent;
	while (currentParent !== null) {
		top += currentParent.offsetTop;
		currentParent = currentParent.offsetParent;
	}
	return top;
}

let width = document.documentElement.clientWidth;

window.$ = (function (elem) {
	let nodes = {}
	if (typeof elem === 'string') {
		let elems = [...document.querySelectorAll(elem)];
		elems.forEach((item, index) => {
			nodes[index] = item;
		})
		nodes.length = elems.length;
	} else {
		nodes[0] = elem;
		nodes.length = 1;
	}
	nodes.addClass = function (className) {
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].classList.add(className)
		}
	}
	nodes.setText = function (text) {
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].textContent = text;
		}
	}

	return nodes;
})()

Promise.prototype.finally = function (cb) {
	let p = this.constructor
	return this.then(
		value => p.resolve(cb()).then(() => value),
		reason => p.resoluve(cb()).then(() => { throw reason })
	)
}

function preloadImage(path) {
	return new Promise((resolve, reject) => {
		let image = new Image;
		image.onload = resolve;
		image.onerror = reject;
		image.src = path;
	})
}

// 防止用户恶意输入
function safeHTML(temp) {
	let str = temp[0]
	for (let i = 1; i < arguments.length; i++) {
		let arg = String(arguments[i])
		str += arg.replace(/&/g, '&amp')
			.replace(/</g, '&lt')
			.replace(/>/g, '&gt')
		str += temp[i]
	}
	return str;
}

// 可以通过此方法在ES5环境下部署Number.isFinite/isNaN
(function (global) {
	Object.defineProperty(Nubmer, 'isFinite', {
		value: function isFinite(value) {
			return typeof value === 'number' && global.isFinite(value)
		},
		enumerable: false,
		configurable: true,
		writable: true,
	})
})(window);

(function (global) {
	Object.defineProperty(Number, 'isInteger', {
		value: function isInteger(value) {
			return typeof value === 'number'
				&& global.isFinite(value)
				&& Math.floor(value) === value;
		},
		enumerable: false,
		configurable: true,
		writable: true
	})
})(window);

// 最小误差
function withinErrorMargin(left, right) {
	return Math.abs(left - right) < Number.EPSILON;
}

Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 // true
Number.MIN_SAFE_INTEGER === - Number.MAX_SAFE_INTEGER // true

Object.defineProperty(Math, 'trunc', {
	value: function trunc(value) {
		return value < 0 ? Math.ceil(value) : Math.floor(value);
	}
})

Object.defineProperty(Math, 'sign', {
	value: function sign(value) {
		value = +value;
		if (value === 0 || Number.isNaN(value)) {
			return value;
		}
		return value > 0 ? 1 : -1;
	}
})

let store = {
	debug: true,
	state: {
		msg: 'hello world',
	},
	setMsgAction(value) {
		if (this.debug) {
			console.log('setMsgAction', value);
		}
		this.state.msg = value;
	},
	clearMsgAction() {
		if (this.debug) {
			console.log('clearMsgAction');
		}
		this.state.msg = ''
	}
}

function currying(fn, n) {
	return function (m) {
		return fn.call(this, m, n)
	}
}

function factorial(n, total = 1) {
	if (n === 1) return total;
	return factorial(n - 1, n * total);
}
factorial(5) // 120

function tco(f) {
	var value, active = false, accumulated = [];
	return function accumulator() {
		accumulated.push(arguments);
		if (!active) {
			active = true;
			while (accumulated.length) {
				value = f.apply(this, accumulated.shift());
			}
			active = false;
			return value;
		}
	};
}
var sum = tco(function (x, y) {
	if (y > 0) {
		return sum(x + 1, y - 1)
	} else {
		return x
	}
});
sum(1, 100000) // 100001

Object.defineProperty(obj, 'a', {
	value: 1,
	enumerable: true,
	configurable: false,
	writable
})

let mix = object => ({
	with: (...mixins) => mixins.reduce((c, mixin) => Object.create(c, Object.getOwnPropertyDescriptors(mixin)), object)
})

let size = Symbol('size')
class Collection {
	constructor() {
		this[size] = 0
	}
	add(item) {
		this[this[size]] = item;
		this[size]++;
		return this
	}
	static sizeOf(instance) {
		return instance[size]
	}
}
let x = new Collection()
console.log(Collection.sizeOf(x)); // 0
x.add('foo').add('a').add('b')
console.log(Collection.sizeOf(x)); // 3
console.log(Object.keys(x)); // ['0', '1', '2']