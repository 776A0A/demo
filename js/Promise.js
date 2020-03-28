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

    // 处理非函数的情况
    typeof onFullFilled !== 'function' ? onFullFilled = value => value : null;
    typeof onRejected !== 'function' ? onRejected = err => err : null;

    let p;

    switch (this.status) {
      case PENDING:
        p = new P((resolve, reject) => {
          this.onFullFilledArray.push(value => {
            try {
              resolvePromise(p, onFullFilled(value), resolve, reject);
            } catch (err) {
              reject(err);
            }
          });

          this.onRejectedArray.push(reason => {
            try {
              resolvePromise(p, onRejected(reason)), resolve, reject;
            } catch (err) {
              reject(err);
            }
          });
        });
        break;
      case RESOLVED:
        p = new P((resolve, reject) => {
          try {
            resolvePromise(p, onFullFilled(this.value), resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        break;
      case REJECTED:
        p = new P((resolve, reject) => {
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

    return p;
  }
  // 其实就是执行 then 的第二个回调
  catch (onRejected) {
    return this.then(undefined, onRejected);
  }
}

function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) return reject(new TypeError());

  try {
    if (typeof result.then === 'function') {
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
  setTimeout(() => {
    resolve(1);
  }, 1000);
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
    return 3;
  })
  .then(res => {
    console.log(res);
  });;

// export default P;