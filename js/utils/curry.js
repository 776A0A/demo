// 辅助函数，返回已柯里化一部分的函数
const _curry = (fn, ...args) => {
  return function (..._args) {
    return fn.call(this, ...args, ..._args)
  }
}

/**
 * 简单说，参数没传完就返回函数，否则就调用
 * @param {Function} fn 
 * @param {Number} argsLength 
 */
const curry = (fn, argsLength) => {
  const length = argsLength || fn.length;
  return function (...args) {
    if (args.length < length) {
      return curry(_curry(fn, ...args), length - args.length)
    } else {
      return fn.call(this, ...args)
    }
  }
}

const fn = curry(function (a, b, c) {
  console.log([a, b, c]);
})
fn("a", "b", "c")
fn("a", "b")("c")
fn("a")("b")("c")
fn("a")("b", "c")


export default curry