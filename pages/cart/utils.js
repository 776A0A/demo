// 移动端适配rem
!function () {
  function resize() {
    let html = document.documentElement;
    let width = html.clientWidth;
    html.style.fontSize = `${width / 7.5}px`;
  }
  window.addEventListener('resize', resize)
  resize()
}()
// 封装$.ajax，返回一个promise对象
function ajax(url, method = 'get') {
  return new Promise((resolve, reject) => {
    $.ajax({
      url, method,
      success: res => {
        if (res.code === 0) {
          resolve(res.data.food_spu_tags)
        }
      },
      error: err => {
        reject(err)
      }
    })
  })
}

const subscribeEvent = {
  fns: [],
  add(fn) {
    this.fns.push(fn)
    return this;
  },
  remove(fn) {
    return this.fns = this.fns.filter(_fn => _fn !== fn);
  },
  start() {
    for (let i = 0, fns = this.fns, len = fns.length, fn; fn = fns[i++];) {
      fn.apply(this, arguments)
    }
  }
}
