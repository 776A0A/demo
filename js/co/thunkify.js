/**
 * thunk 函数是只接收一个回调函数的函数
 * 所以 thunkify 就是将多参数函数，并且有回调函数的做层封装
 *
 * @param {*} fn
 * @returns
 */
function thunkify (fn) {
  return (...args) => {
    return done => {

      let called;

      done = (...params) => {
        if (called) return;
        called = true;
        done(...params);
      };

      try {
        fn.call(null, ...args, done)
      } catch (err) {
        done(err)
      }

    };
  };
}