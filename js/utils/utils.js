// mvc 用户点击v视图，c监听操作，然后通知v，v到数据库调取数据，然后将数据操作后交给c，c再交给v显示

const debounce = (fn, delay) => {

  return function (...args) {
    fn.tId && clearTimeout(fn.tId)

    fn.tId = setTimeout(() => {
      fn.call(this, ...args)
    }, delay);

  }
}

/**
 * 根据传入1或者-1确定遍历方向
 * @param {Number 1|-1} direction 
 */
const createIndexFinder = direction => {
  return function (arr, fn, ctx) {
    const len = arr.length;
    let i = direction > 0 ? 0 : len - 1;

    for (; i >= 0 && i < len; i += direction) {
      if (fn.call(ctx, arr[i], i, arr)) return i;
    }
  }
}
