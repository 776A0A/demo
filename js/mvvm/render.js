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

      // function replace (text, regExp) {
      //   let _text = text;

      //   const _regExp = new RegExp(regExp);

      //   let matched;

      //   while (matched = _regExp.exec(text)) {

      //     const val = getVal(matched[1], vm);

      //     node.textContent = (_text = _text.replace(matched[0], val));

      //     new Watcher(vm, matched[1], () => replace(text, regExp));

      //   }
      // }

      // replace(text, regExp);

      const val = getVal(RegExp.$1, vm);

      node.textContent = text.replace(regExp, val).trim(); // 需要注意这个node仍然是原来的node，只不过现在在frag内罢了

      /**
       * 只要有 {{}} 模板的就有一个 watcher 
       * 在编译的时候已经将 dom 更新函数确定
       */
      new Watcher(vm, RegExp.$1, newVal => node.textContent = text.replace(regExp, newVal).trim());
    }

    /**
     * 处理 dom 属性上的指令
     */
    if (node.nodeType === Node.ELEMENT_NODE) {
      const nodeAttrs = node.attributes; // 拿到所有属性值，是一个类数组
      Array.from(nodeAttrs).forEach(attr => {
        const name = attr.name;
        const exp = attr.value;

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

          new Watcher(vm, exp, newVal => node.value = newVal);
        }
      });

    }

    node.children && node.children.length && render(node); // 递归

  });
}