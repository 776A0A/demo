const partial = (fn, ...args) => {
  return function (..._args) {
    let argsArr = [];

    for (let i = 0, len = args.length; i < len; i++) {
      argsArr.push(args[i] ? args[i] : _args.shift())
    }
    argsArr = argsArr.concat(..._args);

    return fn.call(this, ...argsArr)
  }
}

const fn = partial(function (a, b, c) {
  console.log(arguments);
  return a + b + c;
}, undefined, undefined, 1)

console.log(fn(2, 3, 4, 5));