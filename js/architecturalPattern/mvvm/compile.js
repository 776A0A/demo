import render from './render.js';

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

