import { dataProxy } from './proxy.js';
import observe from './observe.js';
import Compile from './compile.js';

export default function Mvvm (options = {}) {
  this.$options = options;
  const data = this._data = this.$options.data;

  const vm = this;

  observe(data);

  dataProxy(data, vm);

  new Compile(options.el, vm);
}

