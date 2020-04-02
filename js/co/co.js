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
    if (!g || typeof g.next !== 'function') reject(g);

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
        res = g.next(data);
      } catch (err) {
        reject(err);
      }

      next(res);
    }

    onFullFilled();

    function next (res) {
      const { done, value } = res;
      if (done) return resolve(value);
      if (value && typeof value.then === 'function') return value.then(onFullFilled, onRejected);
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

  const res3 = yield Promise.resolve(res2)

  return res3;
}

co(f).then(data => {
  console.log(data);
});