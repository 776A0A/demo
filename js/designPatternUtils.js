// 设计模式封装
const designPatternUtils = {
  /**
    * 职责链模式
    * @param {function} fn 
    * @returns object
    */
  Chain: class {
    constructor(fn) {
      this.fn = fn;
    }
    setNextSuccessor(nextSuccessor) {
      return this.nextSuccessor = nextSuccessor;
    }
    passRequest() {
      let ret = this.fn.apply(this, arguments)
      if (ret === false) return this.nextSuccessor && this.nextSuccessor.passRequest.apply(this.nextSuccessor, arguments);
      return ret;
    }
  },
  /**
   * 单例模式
   * @param {function} fn
   * @returns function
   */
  getSingle(fn) {
    let instance = null;
    let isConstructor = /[A-Z]/.test(fn.name[0]);
    return function (...rest) {
      // return new Promise(resolve => {
      //   instance = instance || (isConstructor ? new fn(...rest) : fn(...rest));
      //   resolve(instance)
      // })
      return instance = instance || (isConstructor ? new fn(...rest) : fn(...rest));
    }
  }
};

export default designPatternUtils;