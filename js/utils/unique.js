/**
 * 数组去重
 * @param {Array} arr 
 * @param {Boolean} isSorted 
 * @param {Function} iteratee 
 * @param {Object} ctx 
 */
const unique = function (arr, isSorted, iteratee, ctx) {
  // 处理参数
  if (typeof isSorted !== 'boolean') {
    ctx = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }

  const res = []
  let seen = []

  for (let i = 0, len = arr.length; i < len; i++) {
    const val = arr[i];
    const computedVal = iteratee ? iteratee.call(ctx, val, i, arr) : val; // 将值做处理，例如大小写的转换
    if (isSorted) {
      if (!i || seen !== computedVal) {
        res.push(val)
      }
      seen = computedVal; // 将值保存，将在下一轮中与下一轮的值作比较
    }
    else if (iteratee) {
      if (!seen.includes(computedVal)) {
        res.push(val)
        seen.push(computedVal)
      }
    }
    else if (!res.includes(computedVal)) {
      res.push(val)
    }
  }

  return res;
}

console.log(unique([1, 2, 1, '1', 'a', 'A', 'a']));

export default unique