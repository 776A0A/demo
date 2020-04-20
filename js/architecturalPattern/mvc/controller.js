import Model from './model.js'
import View from './view.js';

/**
 * 控制层，也可以理解为中间层，是视图层和数据层的中介
 * 负责将视图层存入数据层views中，同时负责调用数据层的通知函数
 *
 * @class Controller
 */
class Controller {
    constructor () {
        this.model = new Model()
        this.view = new View(this)

        this.init()
    }
    init () {
        this.model.register(this.view)
        this.model.notify()
    }
    increment () {
        this.model.add()
        this.model.notify()
    }
    decrement () {
        this.model.minus()
        this.model.notify()
    }
}

export default Controller;