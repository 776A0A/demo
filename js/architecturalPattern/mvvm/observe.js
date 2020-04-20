import { sharedPropertyDefinition } from './shared.js';
import Dep from './dep.js';

/**
 * 最开始只是做一层劫持，不做任何处理，但是会创建一个依赖池
 * 最开始是处理 options.data
 * 如果检测到值是对象会数组就会递归监听
 * @class Observe
 */
class Observe {
  constructor (data) {
    this.data = data;

    /**
     * 每一个对象都有一个依赖池
     * 只要对象中的一个属性发生变化
     * 那么就会通知所有watcher
     */
    this.dep = new Dep();

    Object.entries(data).forEach(([key, val]) => defineReactive(key, val, this));
  }
}

export default function observe (data) {
  if (typeof data !== 'object' || data === null) return;
  return new Observe(data);
}


function defineReactive (key, val, { data, dep }) {
  observe(val); // 递归，如果值也是对象的话

  Object.defineProperty(data, key, {
    ...sharedPropertyDefinition,
    get () {
      // Dep.target 即是 watcher ，也就是 dom 更新函数
      Dep.target && dep.addSub(Dep.target);

      return val;
    },
    set (newVal) {
      if (val === newVal) return;

      val = newVal; // 为了下次读取属性返回正确的值，也就是 get 中

      observe(newVal); // 新添加的数据如果也是对象，那么也要监听

      dep.notify(); // 更新视图
    }
  });
}