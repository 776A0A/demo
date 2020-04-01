import { baseConfig } from './shared.js';
import Dep from './dep.js';

/**
 * 最开始是处理 options.data
 * 如果检测到值是对象会数组就会递归监听 
 *
 * @param {*} data
 */
function Observe (data) {
  const dep = new Dep(); // 每一个对象都有一个依赖池

  Object.entries(data).forEach(([key, val]) => {

    observe(val);

    Object.defineProperty(data, key, {
      ...baseConfig,
      get () {
        // Dep.target 即是 watcher ，也就是 dom 更新函数
        Dep.target && dep.addSub(Dep.target);

        return val;
      },
      set (newVal) {
        if (val === newVal) return;

        val = newVal;

        observe(newVal); // 新添加的数据如果也是对象，那么也要监听

        dep.notify();
      }
    });
  });
}

export default function observe (data) {
  if (typeof data !== 'object' || data === null) return;
  return new Observe(data);
}