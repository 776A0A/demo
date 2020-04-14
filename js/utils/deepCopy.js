import type from './type.js'

/**
 * 使用循环代替递归，深拷贝数据
 * 传入对象Object或者数组，可拷贝正则及日期对象
 * @param {*} data 
 */
const deepCopy = data => {
  if (type(data) !== 'object' && type(data) !== 'array') return data;

  const dataMap = new Map();
  const res = Array.isArray(data) ? [] : {};

  const stack = [
    {
      origin: data,
      copy: res
    }
  ];

  let _data;

  while (_data = stack.shift()) {
    const { origin, copy } = _data;

    if (dataMap.has(origin)) continue;

    dataMap.set(origin, copy);

    Object.entries(origin).forEach(([key, val]) => {

      if (val instanceof Date) {
        copy[key] = new Date(val.toString())
      } else if (val instanceof RegExp) {
        copy[key] = new RegExp(val.toString())
      } else if (typeof val === 'object' && typeof val !== null) {
        stack.push({
          origin: val,
          copy: Array.isArray(val) ? [] : {}
        })
      }

      copy[key] = val;

    })
  }

  return res;
}


const a = {
  f: 7
}
const obj = [new Date(), /avc/g, 1, 2, { a: 1, b: 3, c: [5, { d: 6 }, a] }, () => { console.log('object'); }, a, a, a];

const res = deepCopy(obj)

console.log(res);

function find (list, f) {
  return list.filter(f)[0]
}

function _deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => copy[key] = deepCopy(obj[key], cache))

  return copy
}


console.time()
for (let i = 0; i < 1000; i++) {
  deepCopy(obj)
}

console.timeEnd()
console.log('-------------');
console.time()
for (let i = 0; i < 1000; i++) {
  _deepCopy(obj)
}
console.timeEnd()







export default deepCopy