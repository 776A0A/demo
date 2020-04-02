/**
 * 获取嵌套对象中对应key的value
 *
 * @export
 * @param {String} exp 例如 a.b
 * @param {Mvvm} vm
 * @returns *
 */
export function getVal (exp, vm) {
  return exp
    .split('.')
    .map(
      key => key.trim()
    )
    .reduce(
      (val, key) => val = val[key]
      , vm
    );
}

/**
 * 一个空函数
 */
export const noop = () => { };
