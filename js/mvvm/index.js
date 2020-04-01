import Mvvm from './mvvm.js';

const vm = new Mvvm({
  el: '#app',
  data: {
    a: {
      b: 1
    },
    c: 2
  }
});

document.getElementById('btn').addEventListener('click', e => {
  vm.c = Math.random();
});

console.log(vm);