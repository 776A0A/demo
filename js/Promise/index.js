class P {
  constructor (handler) {
    this.status = 'pending'; // promise 的状态
    this.value = this.reason = undefined; // 初始值
    this.onFullFilledArray = []; // 用于异步时保存处理函数
    this.onRejectedArray = [];

    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'resolved';
        this.value = value;
        this.onFullFilledArray.forEach(fn => fn(this.value));
      }
    };

    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedArray.forEach(fn => fn(this.reason));
      }
    };

    try {
      handler(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then (onFullFilled, onRejected) {
    let p; // 为了链式调用返回另一个 promise 对象

    switch (this.status) {
      case 'pending': // 当调用 then 时，如果状态还是 pending，则保存处理函数
        p = new P((resolve, reject) => {
          this.onFullFilledArray.push(value => {
            try {
              resolvePromise(p, onFullFilled(value), resolve, reject); // 并将处理函数返回值传递给新的 promise 对象
            } catch (err) {
              reject(err);
            }
          });

          this.onRejectedArray.push(reason => {
            try {
              resolvePromise(p, onRejected(reason), resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        break;
      case 'resolved':
        p = new P((resolve, reject) => {
          try {
            resolvePromise(p, onFullFilled(this.value), resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        break;
      case 'rejected':
        p = new P((resolve, reject) => {
          try {
            resolvePromise(p, onRejected(this.reason), resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      default:
        console.error('无法捕获到状态');
        break;
    }

    return p;
  }
}


function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) reject(new TypeError());

  try {
    if (typeof result.then === 'function') {
      result.then(
        res => resolvePromise(res),
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
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

p
  .then(
    res => {
      console.log(res);
      return 2;
    },
    err => {
      console.log(err);
      return 4;
    }
  )
  .then(res => {
    console.log(res);
    return () => {
      console.log(999);
    };
  })
  .then(res => {
    res();
  });
