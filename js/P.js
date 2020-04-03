class P {
  constructor (executor) {
    this.state = 'pending';
    this.value = this.reason = undefined;
    this.onFullFilledArray = [];
    this.onRejectedArray = [];

    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'resolved';
        this.value = value;

        let fn;
        while (fn = this.onFullFilledArray.shift()) fn(this.value);

      }
    };
    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;

        let fn;
        while(fn = this.onRejectedArray.shift()) fn(this.reason)

      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }

  }
  then (onFullFilled, onRejected) {
    if (typeof onFullFilled !== 'function') onFullFilled = value => value;
    if (typeof onRejected !== 'function') onRejected = reason => reason;

    let called;

    const p = new P((resolve, reject) => {
      switch (this.state) {
        case 'pending':
          this.onFullFilledArray.push(value => {
            if (called) return;
            called = true;
            // 通过setTimeout来模拟异步任务
            setTimeout(() => {
              try {
                resolvePromise(p, onFullFilled(value), resolve, reject);
              } catch (e) {
                reject(e);
              }
            });
          });
          this.onRejectedArray.push(reason => {
            if (called) return;
            called = true;
            setTimeout(() => {
              try {
                resolvePromise(p, onRejected(reason), resolve, reject);
              } catch (e) {
                reject(e);
              }
            });
          });
          break;
        case 'resolved':
          if (called) return;
          called = true;
          setTimeout(() => {
            try {
              resolvePromise(p, onFullFilled(this.value), resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          break;
        case 'rejected':
          if (called) return;
          called = true;
          setTimeout(() => {
            try {
              resolvePromise(p, onRejected(this.reason), resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          break;
        default:
          reject(new Error(`没有捕获到状态`))
          break;
      }
    });

    return p;
  }
}

function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) return reject(new TypeError())

  try {
    if (typeof result.then === 'function') {
      result.then(
        val => resolvePromise(promise, val, resolve, reject),
        rea => reject(rea)
      )
    } else {
      resolve(result)
    }
  } catch (e) {
    reject(e)
  }
}

new P(resolve => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then(res => {
    console.log(res);
    return 2;
  })
  .then(res => {
    console.log(res);
    return new P(resolve => {
      setTimeout(() => {
        resolve(5)
      }, 1000);
    })
  })
  .then(res => {
    console.log(res);
    console.log(6);
  })