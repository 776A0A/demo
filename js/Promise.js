class P {
  constructor (handler) {
    this.status = 'pending';
    this.value = this.reason = undefined;
    this.onFullFilledArray = [];
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
    let p;

    switch (this.status) {
      case 'pending':
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


export default P;