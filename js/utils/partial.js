const partial = (fn, ...args) => {
  return function (..._args) {

    for (let i = 0, len = args.length; i < len; i++) {
      args[i] ? null : (args[i] = _args.shift())
    }
    
    args = args.concat(..._args)

    return fn.call(this, ...args)
  }
}

const fn = partial(function (a, b, c) {
  console.log(arguments);
  return a + b + c;
}, undefined, undefined, 1)

console.log(fn(2, 3, 4, 5));