// app.js
import Router from './router.js'

App.use([Router]) // 依赖注入

class App {
  static modules = []
  constructor (options) {
    this.options = options;

    this.init()
  }
  init () {
    this.initModules() // 初始化依赖
    this.options.onReady() // 调用生命周期函数
  }
  initModules () {
    // 运行所有模块的init方法，也就是说所有模块必须有init，这就是面向接口编程
    App.modules.forEach(module => module.init && typeof module.init === 'function' && module.init(this))
  }
  static use (module) {
    Array.isArray(module) ? module.forEach(_module => App.use(_module)) : App.modules.push(module);
  }
}

new App({
  onReady () { }
})


// router.js
class Router { }

export default {
  init (app) {
    app.router = new Router()
    app.router.to('home')
  }
}