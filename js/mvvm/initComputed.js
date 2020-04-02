import { sharedPropertyDefinition } from './shared.js';
import { noop } from './utils.js';

export default function initComputed () {
  const vm = this;

  const computed = vm.__computed__ = vm.$options.computed;

  if (computed) {
    Object.entries(computed).forEach(([key, val]) => {
      const getter = typeof val === 'function' ? val : val.get;
      const setter = typeof val === 'function' ? noop : val.set;

      /**
       * 实际传入的computed对象是没有处理的
       * 只是把里面的属性拿出来，然后代理在vm上，使得可以通过this.xx访问computed中的值
       * 而在这个过程中，将computed中的值拿出来，给this.xx做一层劫持，也就是设置this.xx
       * 的getter和setter
       * 可以打出vm对象，观察computed中的值，是没有getter和setter的
       */
      Object.defineProperty(vm, key, {
        ...sharedPropertyDefinition,
        get: getter,
        set: setter
      });

    });
  }
}