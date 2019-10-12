// 单例模式
// 只能有一个实例，创建了以后，每次访问都返回同一个实例
function getSingle(fn) {
  let instance;
  return function () {
    return instance || (instance = fn.apply(this, arguments))
  }
}

// 策略模式
// 将方案名作为对象属性名，具体算法作为属性值
// 定义一个变量，自定义要使用那种算法，并提供数据
let levelObj = {
  A(money) {
    return money * 4;
  },
  B(money) {
    return money * 3;
  },
  C(money) {
    return money * 2;
  }
}
let calculateBonus = (level, money) => levelObj[level](money);

// 代理模式
// 先生成一张图片显示loading.gif
// 当执行proxyImg时会生成另一张图片，并且图片会在onload事件发生时再执行一遍createImg函数，生成另一张图片，并附带返回的另一张图片的url
let imgNode = (function () {
  let img = document.createElement('img')
  return {
    setSrc(src) {
      img.src = src;
    }
  }
})()

let proxyImg = (function () {
  let img = new Image()
  img.onload = function () {
    imgNode.setSrc(this.src)
  }
  return {
    setSrc(src) {
      imgNode.setSrc('')
      img.src = src;
    }
  }
})()
// 使用函数形式
let myImage = (function () {
  let img = document.createElement('img')
  document.body.appendChild(img)
  return function (src) {
    img.src = src;
  }
})()
let proxyImage = (function () {
  let img = new Image()
  img.onload = function () {
    myImage(this.src)
  }
  return function (src) {
    myImage('loading.gif')
    img.src = src;
  }
})()

