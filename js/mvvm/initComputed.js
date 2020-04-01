import { sharedPropertyDefinition } from './shared.js';
import { noop } from './utils.js';

export default function initComputed () {
  const vm = this;

  const computed = vm.__computed__ = vm.$options.computed;

  if (computed) {
    Object.entries(computed).forEach(([key, val]) => {
      const getter = typeof val === 'function' ? val : val.get;
      const setter = typeof val === 'function' ? noop : val.set;

      Object.defineProperty(vm, key, {
        ...sharedPropertyDefinition,
        get: getter,
        set: setter
      });

    });
  }
}