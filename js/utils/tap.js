// 对于一个函数队列，在外包裹一层，方便调试和debug
const tap = fns => fns.map(fn => param => {
  let res = fn(param);
  console.log(res); // debug 用
  return res;
});


const f1 = (p) => 1 + p;
const f2 = (p) => 1 + p;
const f3 = (p) => 1 + p;
const f4 = (p) => 1 + p;

const t = tap([f1, f2, f3, f4]);

t.forEach(fn => fn(2));