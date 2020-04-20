import { sharedPropertyDefinition } from './shared.js';

/**
 * 做一层代理，使得可以直接通过this.xx访问属性
 *
 * @param {Object} data
 * @param {Mvvm} vm
 */
export function proxy (data, key, vm) {
  Object.entries(data).forEach(([_key, val]) => {

    Object.defineProperty(vm, _key, {
      ...sharedPropertyDefinition,
      get: () => vm[key][_key],
      set: newVal => vm[key][_key] = newVal
    });
  });
}