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

/**
 * 可以传入undefined
 * @param {curriedFn} fn 
 */
const _curry_ = function (fn) {
  return function (...args) {
    args = args.filter(arg => arg === undefined);
    return _curry_(fn.call(this, ...args))
  }
}

const fn = curry(function (a, b, c) {
  console.log([a, b, c]);
})

const _fn_ = _curry_(fn);



// fn("a", "b", "c")
// fn("a", "b")("c")
// fn("a")("b")("c")
// fn("a")("b", "c")

_fn_(1, undefined, 2, undefined)(3)
_fn_(undefined, 1, 2, 3)
_fn_(1, undefined, 2)(3)
_fn_(1, undefined, undefined)(2, undefined)(undefined, 3)
_fn_(undefined, 1)(undefined, undefined, 2)(undefined)(3)
// _fn_("a", "b", "c")
// _fn_("a", undefined, "b")("c")
// _fn_("a", undefined)("b")("c")
// _fn_("a")("b", "c")


export default curry
