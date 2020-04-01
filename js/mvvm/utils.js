/**
 * 获取嵌套对象中对应key的value
 *
 * @export
 * @param {String} exp 例如 a.b
 * @param {Mvvm} vm
 * @returns *
 */
export function getVal (exp, vm) {
  const keyArr = exp.split('.').map(key => key.trim());

  let val = vm;

  return keyArr.reduce((val, key) => val = val[key], val);
}

/**
 * 一个空函数
 */
export const noop = () => { };
