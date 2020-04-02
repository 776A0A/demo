const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class P {
  constructor (executor) {
    this.status = PENDING;
    this.value = this.reason = undefined;
    this.onFullFilledArray = [];
    this.onRejectedArray = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = value;
        this.onFullFilledArray.forEach(fn => fn(this.value));
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

  then (onFullFilled, onRejected) {

    // 处理非函数的情况，直接将值返回，也就是值穿透
    typeof onFullFilled !== 'function' ? (onFullFilled = value => value) : null;
    typeof onRejected !== 'function' ? (onRejected = err => err) : null;

    return new P((resolve, reject) => {
      switch (this.status) {
        case PENDING:
          this.onFullFilledArray.push(value => {
            setTimeout(() => { // 使用setTimeout来模拟异步执行，虽然加入的是task
              try {
                resolvePromise(p, onFullFilled(value), resolve, reject);
              } catch (err) {
                reject(err);
              }
            });
          });

          this.onRejectedArray.push(reason => {
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
          setTimeout(() => {
            try {
              resolvePromise(p, onFullFilled(this.value), resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
          break;
        case REJECTED:
          setTimeout(() => {
            try {
              resolvePromise(p, onRejected(this.reason)), resolve, reject;
            } catch (err) {
              reject(err);
            }
          });
          break;
        default:
          console.error('无法捕获到状态');
          break;
      }
    });
  }
  // 其实就是执行 then 的第二个回调
  catch (onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve (value) {
    return new P(resolve => resolve(value));
  }

  static reject (reason) {
    return new P((resolve, reject) => reject(reason));
  }

  static race (promises) {
    return P((resolve, reject) => promises.forEach(p => p.then(resolve, reject)));
  }

  static all (promises) {
    const res = []
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
        res => resolvePromise(promise, res, resolve, reject),
        err => reject(err)
      );
    } else {
      resolve(result);
    }
  } catch (err) {
    reject(err);
  }
}


const p = new P((resolve, reject) => {
  resolve(1);
});

p.then(res => {
  console.log(res);
  setTimeout(() => {
    console.log(2);
  }, 1000);
  return 2;
})
  .then(res => {
    console.log(res);
    setTimeout(() => {
      console.log(3);
    }, 3000);
    return new P(resolve => {
      resolve(4);
    });
  })
  .then(res => {
    console.log(res);
  });;

// export default P;