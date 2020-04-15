/**
 * 默认从左到右依次执行
 * @param {Array<Function>} fns 
 * @param {Boolean} fromLeft
 */
const compose = (fns, fromLeft = true) => {
  if (!fromLeft) fns = fns.reverse();
  return fns.reduce((fn, currFn) => (...args) => currFn(fn(...args)))
}


const a1 = str => str.slice(0, 1);
const a2 = str => str.toUpperCase();
const a3 = str => `hello ${str}`

const a4 = compose([a1, a2, a3])

console.log(a4('wj'));
