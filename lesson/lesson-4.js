import utils from '../js/utils.js'
let { Chain } = utils;
window.onload = function () {
  controller.triggerUpdate()
}
let view = {
  regionDOMLists: [...document.getElementsByName('regionSelect')],
  productDOMLists: [...document.getElementsByName('productSelect')],
  regionAllSelect: document.getElementById('regionAllSelect'),
  productAllSelect: document.getElementById('productAllSelect')
}
let model = {
  regionList: ['华东'],
  productList: [],
  html: ''
}

let controller = {
  handleEvent(e) {
    if (this.name === 'regionSelect') controller.handleRegion.call(this, e, this.value);
    if (this.name === 'productSelect') controller.handleProduct.call(this, e, this.value);
    controller.triggerUpdate()
  },
  triggerUpdate() {
    sourceData.forEach(item => chainSelectBoth.passRequest(item))
    return controller.updateDOM()
  },
  handleRegion(e, value) {
    if (model.regionList.length === 1 && model.regionList.includes(value) && model.productList.length === 0) {
      return e.preventDefault()
    }
    model.regionList = controller.updateSelectedList(view.regionDOMLists);
    view.regionAllSelect.checked = model.regionList.length === 3 ? true : false;
    return model.regionList;
  },
  handleProduct(e, value) {
    if (model.productList.length === 1 && model.productList.includes(value) && model.regionList.length === 0) {
      return e.preventDefault()
    }
    model.productList = controller.updateSelectedList(view.productDOMLists);
    view.productAllSelect.checked = model.productList.length === 3 ? true : false;
    return model.productList;
  },
  bindEvent(domLis, cb) {
    domLis.forEach(item => {
      item.addEventListener('click', function (e) {
        cb.call(this, e)
      })
    })
  },
  updateSelectedList(domList) {
    let arr = domList.filter(item => item.checked);
    return arr.map(item => item.value)
  },
  handleDOM(item) {
    let saleHTML = '',
      html = model.html;
    item.sale.forEach(s => {
      saleHTML += `<td>${s}</td>`
    })
    html += `<tr>
          <td>${item.region}</td>
          <td>${item.product}</td>
          ${saleHTML}
        </tr>`
    return model.html = html;
  },
  updateDOM() {
    document.getElementById('tableWrapper').querySelector('tbody').innerHTML = model.html;
    return model.html = ''
  },
}
// 绑定事件
controller.bindEvent(view.regionDOMLists, controller.handleEvent)
controller.bindEvent(view.productDOMLists, controller.handleEvent)
controller.bindEvent([view.regionAllSelect], function (e) {
  if (this.checked) {
    [...document.getElementsByName('regionSelect')].forEach(item => {
      if (!item.checked) {
        item.click()
      }
    })
  }
})
controller.bindEvent([view.productAllSelect], function (e) {
  if (this.checked) {
    e.preventDefault();
    [...document.getElementsByName('productSelect')].forEach(item => {
      if (!item.checked) {
        item.click()
      }
    })
  }
})

let chainNodeFn = {
  bothSelect(item) {
    if (model.regionList.includes(item.region) && model.productList.includes(item.product)) return model.html = controller.handleDOM(item);
    return false;
  },
  selectRegion(item) {
    if (model.regionList.includes(item.region) && !model.productList.length) return model.html = controller.handleDOM(item);
    return false;
  },
  selectProduct(item) {
    if (model.productList.includes(item.product) && !model.regionList.length) return model.html = controller.handleDOM(item);
    return false;
  }
}
// 职责链节点函数
let chainSelectBoth = new Chain(chainNodeFn.bothSelect), chainSelectRegion = new Chain(chainNodeFn.selectRegion), chainSelectProduct = new Chain(chainNodeFn.selectProduct);
chainSelectBoth.setNextSuccessor(chainSelectRegion).setNextSuccessor(chainSelectProduct)