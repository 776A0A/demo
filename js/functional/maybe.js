export default class Maybe {
  constructor (val) {
    this.val = val;
  }
  /**
   * 相当于是工厂模式了
   *
   * @static
   * @param {*} val
   * @returns Maybe
   * @memberof Maybe
   */
  static of (val) {
    return new Maybe(val)
  }
  /**
   * 将错误处理抽象出来
   *
   * @returns Boolean
   * @memberof Maybe
   */
  isNothing () {
    return this.val === undefined || this.val === null;
  }
  /**
   * 传入回调，处理后返回新的Maybe实例
   * 实现链式调用
   *
   * @param {Function} fn
   * @returns Maybe
   * @memberof Maybe
   */
  map (fn) {
    // 使用此种方式，即是传入值有问题，也不会导致程序崩溃
    return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this.val))
  }
}