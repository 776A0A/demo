import Watcher from './watcher.js';

export default function Compile (selector, vm) {
  vm.$el = document.querySelector(selector);

  if (!vm.$el) return;

  const frag = document.createDocumentFragment();

  let child;

  // 当 append 的时候，会将原来的 dom 移动到 frag 下
  while (child = vm.$el.firstChild) frag.appendChild(child);

  render(frag, vm);

  vm.$el.appendChild(frag); // 移回去

}

function render (frag, vm) {

  Array.from(frag.childNodes).forEach(node => {
    const text = node.textContent;
    const regExp = /\{\{(.*?)\}\}/g;

    if (regExp.test(text)) {
      const arr = RegExp.$1.split('.');
      let val;

      arr.forEach(key => val = vm[key.trim()]);

      node.textContent = text.replace(regExp, val).trim(); // 需要注意这个node仍然是原来的node，只不过现在在frag内罢了

      /**
       * 只要有 {{}} 模板的就有一个 watcher 
       */
      // 在编译的时候已经将 dom 更新函数确定
      new Watcher(vm, RegExp.$1, newVal => node.textContent = text.replace(regExp, newVal).trim());

    }

    node.children && node.children.length && render(node); // 递归

  });
}