/**
 * 扩展对象，返回目标对象，也就是第一个参数
 * @param  {Array<Object>} objs 
 */
const extend = (...objs) => {
  const target = objs.shift();

  objs = objs.reduce((obj, item) => ({ ...obj, ...item }));

  Object.keys(objs).forEach(key => {
    target[key] = objs[key]
  })

  return target
}


const a = {
  a: 1,
  b: 2,
  d: {
    f: 5,
    h: 8,
    i: 9
  }
}

const b = {
  a: 3,
  c: 4,
  d: {
    f: 6,
    g: 7
  }
}

const c = extend(a, b);

// const c = Object.assign(a, b)

console.log(c);
console.log(a === c);

export default extend