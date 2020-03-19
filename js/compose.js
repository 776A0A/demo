/**
 * 组合函数，当函数返回值为另一个函数的返回值时
 * @param {function|[function]} 函数列表 
 * @returns *
*/
const compose = (...fns) => {
  // 处理传入的如果是函数数组
  fns = Array.isArray(fns[0]) ? fns[0] : fns;
  return param => {
    let fn;
    while ((fn = fns.pop())) {
      param = fn(param);
    }
    return param;
  };
};

const f1 = (p) => 1 + p;
const f2 = (p) => 1 + p;
const f3 = (p) => 1 + p;
const f4 = (p) => 1 + p;


const c = compose([f1, f2, f3, f4]);

console.log(c(10));

export default compose;