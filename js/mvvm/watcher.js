import Dep from './dep.js';
import { getVal } from './utils.js';

export default class Watcher {
  constructor (vm, exp, fn) {
    this.vm = vm;
    this.exp = exp; // 这是匹配到的 data 中的 key，例如 a.b
    this.fn = fn;

    Dep.target = this;

    /**
     * 这里是为了唤起数据 get 方法
     * get 方法内会进行依赖收集
     */
    getVal(exp, vm);

    Dep.target = null;
  }
  /**
   * 执行到这里时，已经对新数据进行过劫持
   *
   * @memberof Watcher
   */
  update () {
    /**
     * 实际上所有的以下三行都是为了唤起 get，然后进行依赖收集
     * 但是唤起依赖收集是有条件的，那就是必须有Dep.target
     * 而Dep.target只会在调用new Watcher时才会有值
     */
    const val = getVal(this.exp, this.vm);

    this.fn(val);
  }
}