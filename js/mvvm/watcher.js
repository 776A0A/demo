import Dep from './dep.js';

export default class Watcher {
  constructor (vm, exp, fn) {
    this.vm = vm;
    this.exp = exp; // 这是匹配到的 data 中的 key，例如 a.b
    this.fn = fn;

    Dep.target = this;

    const arr = exp.split('.');
    let val;

    /**
     * 这里是为了唤起数据 get 方法
     * get 方法内会进行依赖收集
     */
    arr.forEach(key => val = vm[key.trim()]);

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
     * // FIXME 那么这里的问题就是可能存在重复收集
     */
    const arr = this.exp.split('.');
    let val;

    arr.forEach(key => val = this.vm[key.trim()]);

    this.fn(val);
  }
}