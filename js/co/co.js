/**
 * yield 后面必须是 Promise 
 * 在源码中是需要检测是否似乎 Promise 的
 * 有些可以转换为 Promise，比如 thunk 函数等
 *
 * @param {*} g
 * @returns
 */
function co (g) {
  
  return new Promise((resolve, reject) => {

    if (typeof g === 'function') g = g.call(this);
    if (!g || typeof g.next !== 'function') return reject(g);

    /**
     * 做一层封装代理，主要是为了捕获错误
     * 参数是yield后Promise对象的返回值
     * 
     * @param {*} data 
     */

    function onFullFilled (data) {
      let res;

      try {
        res = g.next(data);
      } catch (err) {
        reject(err);
      }

      next(res);
    }

    function onRejected (data) {
      let res;

      try {
        res = g.throw(data);
      } catch (err) {
        reject(err);
      }

      next(res);
    }

    onFullFilled();

    function next ({ value, done }) {
      if (done) return resolve(value); // 在所有异步操作执行完后将返回值返回
      /**
       * 检测是否是一个 Promise 对象
       * 重要的是，只有在该Promise对象调用then的时候才会再次调用g.next()
       * 这就形成了自执行
       */
      if (value && typeof value.then === 'function') return value.then(onFullFilled, onRejected);
      // 否则抛出类型错误
      return onRejected(new TypeError(`NOT A PROMISE`));
    }

  });

}

function* f () {
  const res1 = yield new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });

  console.log(res1);

  const res2 = yield new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, 2000);
  });

  console.log(res2);

  const res3 = yield Promise.resolve(res2);

  return res3;
}

co(f)
  .then(data => {
    console.log(data);
  });