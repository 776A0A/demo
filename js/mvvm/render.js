import Watcher from './watcher.js';
import { getVal } from './utils.js';

export default function render (frag, vm) {
  Array.from(frag.childNodes).forEach(node => {
    const text = node.textContent;
    const regExp = /\{\{(.*?)\}\}/g;

    /**
     * 如果是文本节点，并且带有{{}}
     * 也就是说，不是所有data中的属性都会被依赖收集
     * 只有在dom结构中用到的属性才会进行依赖收集
     * 但是data中所有的属性都会进行数据劫持
     */
    if (node.nodeType === Node.TEXT_NODE && regExp.test(text)) {
      node.textContent = text.replace(regExp, (matched, exp) => getVal(exp, vm)); // 需要注意这个node仍然是原来的node，只不过现在在frag内罢了

      /**
       * 在编译的时候已经将 dom 更新函数确定
       * 只要有 {{}} 模板，那么这个节点就有一个 watcher 
       * 所以同一个节点有多个{{}}，那么也只有一个watcher
       * 在数据发生变化时，会更新整个节点，毕竟无法只更新一个文本的一部分
       */
      // new Watcher(vm, RegExp.$1.trim(), newVal => node.textContent = text.replace(regExp, newVal).trim());
      new Watcher(vm, RegExp.$1.trim(), () => {
        node.textContent = text.replace(regExp, (matched, exp) => getVal(exp, vm)); // 这个exp是捕获组内容
      });
    }

    /**
     * 处理 dom 属性上的指令，此node就是一个属性节点
     */
    if (node.nodeType === Node.ELEMENT_NODE) {
      const nodeAttrs = node.attributes; // 拿到所有属性值，是一个类数组
      Array.from(nodeAttrs).forEach(attr => {
        const name = attr.name;
        const exp = attr.value.trim();

        if (name.includes('v-')) {
          /**
           * 实现v-model双向绑定
           */
          if (name.includes('model')) {
            let val = vm;
            let obj; // 需要保留这个val对应的对象，在下面赋值时用

            const arr = exp.split('.').map(key => key.trim());
            const len = arr.length;

            arr.forEach(key => (obj = val) && (val = val[key]));

            node.value = val;

            node.addEventListener('input', ({ target: { value } }) => obj[arr[len - 1]] = value);
          }

          new Watcher(vm, exp.trim(), () => node.value = getVal(exp, vm));
        }
      });

    }

    node.children && node.children.length && render(node); // 递归

  });
}