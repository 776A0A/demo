let selectedGoods = [];

setLeftItem()
setBottomCart()

subscribeEvent.add(updateRedIcon)

let $leftPart = $('#left-part')
// 请求左边数据
function setLeftItem() {
  return new Promise(resolve => {
    ajax('../../assets/json/food.json')
      .then(res => res.forEach(item => renderLeftItem(item)))
  })
}
// 渲染左边数据，将在内部进行初始化，然后重写此函数
let renderLeftItem = function (item) {
  _renderLeftItem(item).click() // 初始化左边第一个元素，点击是为了渲染出右边数据
  renderLeftItem = _renderLeftItem; // 内部重写函数
}
// 左边渲染操作
function _renderLeftItem(item) {
  // 替换模板字符串
  let html = leftTemp
    .replace('__icon__', item.icon ? `<img src="${item.icon}" class="left-item-icon">` : '')
    .replace('__name__', item.name);

  let $target = $(html); // 转换为jq对象

  $target.data('itemData', item).on('click', function (e) { // 添加点击事件
    let $this = $(this);

    $this.addClass('active').siblings().removeClass('active'); // 切换active类
    let data = $this.data('itemData'); // 拿到存储在本dom上的数据

    setRightItem(data) // 请求渲染右边数据
  })

  $leftPart.append($target) // 添加到dom中

  return $target;
}
function setRightItem(data) {
  $('#right-part').html('') // 先将右边数据清空
  data.spus.forEach(item => {
    let str = rightTemp
      .replace('__min_price__', item.min_price)
      .replace('__value__', item.chosenNum ? item.chosenNum : '0');
    let $target = $(str);
    $target.data('itemData', item).on('click', function (e) {
      let elemClass = $(e.target).attr('class');
      if (elemClass === 'minus') {
        handleMinus(this)
      } else if (elemClass === 'plus') {
        handlePlus(this)
      } else {
        return;
      }
    })
    item.chosenNum = item.chosenNum || 0; // 添加一个新属性，保存用户添加的商品数量
    $('#right-part').append($target);
  })
}

function handlePlus(outerDom) {
  $(outerDom).data('itemData').chosenNum += 1;
  updateInput(outerDom, 1)
  updateSelectedGoods($(outerDom).data('itemData'))
}
function handleMinus(outerDom) {
  if ($(outerDom).data('itemData').chosenNum === 0) return;
  $(outerDom).data('itemData').chosenNum -= 1;
  updateInput(outerDom, -1)
  updateSelectedGoods($(outerDom).data('itemData'))
}
function updateInput(outerDom, num) {
  $(outerDom).find('.goods-number-input').val($(outerDom).data('itemData').chosenNum)
  subscribeEvent.start(num)
}

function setBottomCart() {
  $('#cart-wrapper').find('.cart-controller').html(cartControllerTemp).find('.shop-icon-wrapper').on('click', function (e) {
    if ($('#mask').attr('class') === 'mask') {
      $('#mask').removeClass('mask')
      setTimeout(() => {
        $('#mask').css('display', 'none')
      }, 0);
    } else {
      $('#mask').css('display', 'block')
      setTimeout(() => {
        $('#mask').addClass('mask')
      }, 0);
    }
    renderCartGoodsList()
  })
}

function updateRedIcon(num) {
  let _num = Number($('.red-icon').html());
  $('.red-icon').html(_num + num)
}

function updateSelectedGoods(goods) {
  if (goods.chosenNum === 0) {
    selectedGoods = selectedGoods.filter(item => item !== goods);
  } else {
    if (!selectedGoods.includes(goods)) selectedGoods.push(goods);
  }
}

function renderCartGoodsList() {
  $('.cart-list').html('')
  selectedGoods.forEach(item => {
    let html = goodsItemTemp
      .replace('__name__', item.name)
      .replace('__min_price__', item.min_price)
      .replace('__chosenNum__', item.chosenNum);
    $('.cart-list').append($(html))
  })
}
