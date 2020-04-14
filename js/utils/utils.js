// mvc 用户点击v视图，c监听操作，然后通知v，v到数据库调取数据，然后将数据操作后交给c，c再交给v显示

const debounce = (fn, delay) => {

  return function (...args) {
    fn.tId && clearTimeout(fn.tId)

    fn.tId = setTimeout(() => {
      fn.call(this, ...args)
    }, delay);

  }
}
