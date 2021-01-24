import { proxy } from './proxy.js';
import Compile from './compile.js';
import initLifeCycle from './lifecycle.js';
import initData from './initData.js';
import initComputed from './initComputed.js';
import initMethod from './method'

export default function Mvvm (options = {}) {
  this.$options = options;

  initData.call(this); // 数据劫持
  initComputed.call(this); // 不需要做数据劫持，因为不是函数，就是带有get和set的对象

  proxy(options.data, `__data__`, this); // 将vm._data.a代理为vm.a

  new Compile(options.el, this);

  initMethod(this)

  initLifeCycle(this);
}