// mvc m 用来处理数据，不会出现dom操作 v 用来获取数据 c 操作dom等东西
// 初始化数据 init 中
// 用户点击v视图，c监听操作，然后通知v，v到数据库调取数据，然后将数据操作后交给c，c再交给v显示

// 常用工具函数
const utils = {
  addEvent(dom, fn, type = 'click') {
    dom.addEventListener(type, e => fn.call(e.target, e))
    return this;
  }
}

export default utils
