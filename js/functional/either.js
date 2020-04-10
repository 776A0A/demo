/**
 * 这两个类完全相同，nothing只是用来处理错误
 * 完全相同可以避免在出现错误后没有map方法二产生的另一个错误
 * nothing的map只是将实例返回，而这个实例上保留了错误信息
 * 在最后就能捕获到错误信息，并且原来的map链式调用并不需要修改
 * 
 * 相当于是升级版的maybe，因为maybe中出现了错误只会返回null
 */

class Nothing {
  constructor (val) {
    this.val = val;
  }
  static of (val) {
    return new Nothing(val)
  }
  map () {
    return this
  }
}

class Some {
  constructor (val) {
    this.val = val
  }
  static of (val) {
    return new Some(val)
  }
  map (fn) {
    return new Some(fn(this.val))
  }
}

const Either = {
  Some, Nothing
};


/**
 * 使用
 */

/**
 * 对请求进行包装
 * @param {*} type 
 */
const _getSomething = type => {
  let res;

  try {
    res = Some.of('url')
  } catch (error) {
    res = Nothing.of({ errMsg: 'SOMETHING WENT WRONG' })
  }

  return res;
}

const getSomething = type => {
  const res = _getSomething(type);

  return res.map(res => res).map(res => res); // 即使出现了错误，仍然可以进行这种链式map调用
}

