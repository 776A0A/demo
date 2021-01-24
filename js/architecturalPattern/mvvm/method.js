import observe, { defineReactive } from './observe';

export default function (vm) {
  vm.prototype.$set = function (obj, key, val) {
    const ob = obj?.__ob__
    defineReactive(key, val, ob)
  }
}