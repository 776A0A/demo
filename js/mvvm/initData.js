import observe from './observe.js';

export default function initData () {
  
  const vm = this;

  const data = vm.__data__ = vm.$options.data;

  observe(data);
}
