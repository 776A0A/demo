import { baseConfig } from './shared.js';

/**
 * 做一层代理，使得可以直接通过this.xx访问属性
 *
 * @param {Object} data
 * @param {Mvvm} vm
 */
export function dataProxy (data, vm) {
  Object.entries(data).forEach(([key, val]) => {
    Object.defineProperty(vm, key, {
      ...baseConfig,
      get () {
        return vm._data[key];
      },
      set (newVal) {
        vm._data[key] = newVal;
      }
    });
  });
}