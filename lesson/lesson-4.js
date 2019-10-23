import utils from '../js/utils.js'
let { Chain } = utils;
let regionList = ['华东'],
  productList = [],
  html = '';
let regionAllSelect = document.getElementById('regionAllSelect'),
  productAllSelect = document.getElementById('productAllSelect');
window.onload = function () {
  bindEvent()
  triggerUpdate()
}
regionAllSelect.addEventListener('click', function (e) {
  if (this.checked) {
    [...document.getElementsByName('regionSelect')].forEach(item => {
      if (!item.checked) {
        item.click()
      }
    })
  } 
})
productAllSelect.addEventListener('click', function (e) {
  if (this.checked) {
    e.preventDefault();
    [...document.getElementsByName('productSelect')].forEach(item => {
      if (!item.checked) {
        item.click()
      }
    })
  } 
})
// 处理必须保留一个选择的函数
function handleRegion(e, value) {
  if (regionList.length === 1 && regionList.includes(value) && productList.length === 0) {
    return e.preventDefault()
  }
  regionList = updateSelectedList(this.regionSelect);
  if (regionList.length === 3) {
    regionAllSelect.checked = true;
  } else {
    regionAllSelect.checked = false;
  }
  return regionList;
}
function handleProduct(e, value) {
  if (productList.length === 1 && productList.includes(value) && regionList.length === 0) {
    return e.preventDefault()
  }
  productList = updateSelectedList(this.productSelect);
  if (productList.length === 3) {
    productAllSelect.checked = true;
  } else {
    productAllSelect.checked = false;
  }
  return productList;
}
// 更新列表后触发更新dom
function triggerUpdate() {
  sourceData.forEach(item => chainSelectBoth.passRequest(item))
  return updateDOM()
}
// 职责链节点函数
let chainSelectBoth = new Chain(bothSelect), chainSelectRegion = new Chain(selectRegion), chainSelectProduct = new Chain(selectProduct);
chainSelectBoth.setNextSuccessor(chainSelectRegion).setNextSuccessor(chainSelectProduct)
function bothSelect(item) {
  if (regionList.includes(item.region) && productList.includes(item.product)) return html = handleDOM(item);
  return false;
}
function selectRegion(item) {
  if (regionList.includes(item.region) && !productList.length) return html = handleDOM(item);
  return false;
}
function selectProduct(item) {
  if (productList.includes(item.product) && !regionList.length) return html = handleDOM(item);
  return false;
}
// --------------------------------------------------------------------------
function bindEvent() {
  let selectForm = document.getElementById('selectForm');
  selectForm.addEventListener('click', function (e) { // click事件在change事件之前发生
    let target = e.target, name = target.name;
    if (name === 'regionSelect') handleRegion.call(this, e, target.value);
    if (name === 'productSelect') handleProduct.call(this, e, target.value);
    triggerUpdate()
  })
}
function updateSelectedList(domList) {
  let arr = [...domList].filter(item => item.checked);
  return arr.map(item => item.value)
}

function updateDOM() {
  document.getElementById('tableWrapper').querySelector('tbody').innerHTML = html;
  return html = ''
}

function handleDOM(item) {
  let saleHTML = ''
  item.sale.forEach(s => {
    saleHTML += `<td>${s}</td>`
  })
  html += `<tr>
          <td>${item.region}</td>
          <td>${item.product}</td>
          ${saleHTML}
        </tr>`
  return html;
}


