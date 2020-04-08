/**
 * state machine 状态机管理
 *
 * @class SM
 */
class SM {
  constructor (config) {
    this._config = config;
    this._transitions = config.transitions; // 一个对象数组，保存一个名称及两个状态
    this._methods = config.methods; // 回调函数
    this.state = config.init; // 初始状态

    this.init()
  }
  init () {
    this.addTransitions()
  }
  addTransitions () {
    this._transitions.forEach(({ name, from, to }) => {

      this[`${name}`] = arg => {

        if (this.state === from) {

          this.state = to; // 改变状态

          this._methods[`on${name[0].toUpperCase()}${name.slice(1)}`](this.state, arg) // 调用回调，也就是methods中的方法
        }

      }

    })
  }
  is (state) {
    return this.state === state;
  }
}

/**
 * 一个极简易Promise，将状态交给外部来管理
 *
 * @class P
 */
class P {
  constructor (executor) {
    this.successList = []
    this.failedList = []

    executor(
      () => fsm.resolve(this),
      () => fsm.reject(this)
    )
  }
  then (s, f) {
    this.successList.push(s)
    this.failedList.push(f)
  }
}

const fsm = new SM({
  init: 'pending',
  transitions: [
    {
      name: 'resolve',
      from: 'pending',
      to: 'fulfilled'
    },
    {
      name: 'reject',
      from: 'pending',
      to: 'rejected'
    }
  ],
  methods: {
    onResolve (state, data) {
      console.log(`现在的状态是：`, state);
      data.successList.forEach(fn => fn())
    },
    onReject (state, data) {
      console.log(`现在的状态是：`, state);
      data.failedList.forEach(fn => fn())
    }
  }
})


const p = new P((resolve, reject) => {
  setTimeout(() => {
    resolve()
  });
})

p.then(
  () => console.log('resolved'),
  () => console.log('rejected')
)

console.log(fsm);