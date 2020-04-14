const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

let pId = 0;

class P {
  constructor (executor) {
    this.status = PENDING;
    this.value = this.reason = undefined;
    this.onFulfilledArray = [];
    this.onRejectedArray = [];
    this.pId = pId++;
    // debugger

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        this.onFulfilledArray.forEach(fn => fn(this.value));
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedArray.forEach(fn => fn(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then (onFulfilled, onRejected) {
    /**
     * 要注意下面执行的代码中this的指向，实际上是指向上一个promise
     */

    // 处理非函数的情况，直接将值返回，也就是值穿透
    if (typeof onFulfilled !== 'function') onFulfilled = value => value;
    // 当没有传入catch函数时，如果错误也依然会触发onRejected并抛出错误，这样使得该Promise的状态变为rejected
    if (typeof onRejected !== 'function') onRejected = reason => { throw reason };

    let called;

    /**
     * 为了要链式调用，自然是要返回一个promise
     * 这里传入的resolve，reject更像是一个中介
     * 为了将结果传递给下一个then的回调
     * 另外，then中产生的promise对象，其executor就是下面这些代码
     */
    const p = new P((resolve, reject) => {

      switch (this.status) {
        case PENDING:

          this.onFulfilledArray.push(value => {

            if (called) return;
            called = true;

            setTimeout(() => {
              try {
                resolvePromise(p, onFulfilled(value), resolve, reject);
              } catch (err) {
                reject(err);
              }
            });

          });

          this.onRejectedArray.push(reason => {

            if (called) return;
            called = true;

            setTimeout(() => {
              try {
                resolvePromise(p, onRejected(reason)), resolve, reject;
              } catch (err) {
                reject(err);
              }
            });

          });
          break;
        case RESOLVED:

          if (called) return;
          called = true;

          // 使用setTimeout来模拟异步执行，虽然加入的是task
          setTimeout(() => {
            try {
              resolvePromise(p, onFulfilled(this.value), resolve, reject);
            } catch (err) {
              reject(err);
            }
          });

          break;
        case REJECTED:

          if (called) return;
          called = true;

          setTimeout(() => {
            try {
              resolvePromise(p, onRejected(this.reason)), resolve, reject;
            } catch (err) {
              reject(err);
            }
          });

          break;
        default:
          reject(new Error(`无法捕获到状态`))
          break;
      }
    });

    return p;
  }
  // 其实就是执行 then 的第二个回调
  catch (onRejected) {
    return this.then(undefined, onRejected);
  }

  finally (cb) {
    return this.then(
      val => P.resolve(cb()).then(() => val),
      rea => P.resolve(cb()).then(() => rea)
    )
  }

  static resolve (value) {
    if (value instanceof P) return value;
    return new P((resolve, reject) => {
      if (value && value.then && typeof value.then === 'function') value.then(resolve, reject);
      else resolve(value)
    });
  }

  static reject (reason) {
    return new P((resolve, reject) => reject(reason));
  }

  static race (promises) {
    // P.resolve 将其转换为一个 promise
    return new P((resolve, reject) => promises.forEach(p => P.resolve(p).then(resolve, reject)));
  }

  static all (promises) {

    return new P((resolve, reject) => {

      let i = 0;
      const res = [];

      promises.forEach((p, j) => {

        P.resolve(p)
          .then
          (
            data => {
              i++; // 主要是用来记录到达了then几次
              res[j] = data;
              // 当到达次数为传入个数时，resolve
              if (i === promises.length) {
                resolve(res)
              }
            },
            err => reject(err)
          )

      })
    })

  }

}


/**
 * 相当于对结果做了层代理，处理返回的结果
 *
 * @param {P} promise
 * @param {*} result
 * @param {Function} resolve
 * @param {Function} reject
 * @returns void
 */
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) return reject(new TypeError());

  try {
    if (typeof result === 'object' && result !== null && typeof result.then === 'function') {
      result.then(
        val => resolvePromise(promise, val, resolve, reject),
        rea => reject(rea)
      );
    } else {
      resolve(result);
    }
  } catch (err) {
    reject(err);
  }
}

/**
 * 以下部分都是同步代码，而then中的代码会放入异步队列
 */
new P((resolve, reject) => {
  resolve(1);
})
  .then(res => {
    console.log(res);
    return 2;
  })
  .then(res => {
    console.log(res);
    return new P(resolve => {
      resolve(4);
    });
  })
  .then(res => {
    console.log(res);
  });


// export default P;