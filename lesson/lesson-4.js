import utils from '../js/utils.js'
let { Chain } = utils;
window.onload = function () {
  checkboxController.triggerUpdate() // 初始化数据
}
let checkboxView = {
  regionCheckboxWrapper: document.getElementById('regionCheckbox'),
  productCheckboxWrapper: document.getElementById('productCheckbox'),
  regionDOMLists: [...document.querySelectorAll('#regionCheckbox input')],
  productDOMLists: [...document.querySelectorAll('#productCheckbox input')],
  regionAllSelect: document.getElementById('regionAllSelect'),
  productAllSelect: document.getElementById('productAllSelect')
}
let checkboxModel = {
  regionList: ['华东'], // 已选的地区
  productList: [], // 已选的商品
  html: '', // 将要更新的视图html
  getLowercaseName(elem) {
    let regExp = new RegExp(/(.*)[A-Z]/);
    return regExp.exec(elem.name)[1];
  },
  loopCount: 1, // 合并行单元格时做判断用
}

let checkboxController = {
  bindEvent({ dom, callback, type = 'click' }, ...rest) { // 第1步，绑定事件
    dom.addEventListener(type, e => callback.call(e.target, e, ...rest))
  },
  handleCheckboxClickEvent(e) { // 第2步，根据不同name传入不同的参数
    let elem = e.target;
    if (elem.tagName.toLowerCase() !== 'input') return; // 会先点到label上，是label就返回
    let name = checkboxModel.getLowercaseName(elem);
    let params = {
      value: elem.value,
      list_1: `${name}List`,
      list_2: `${name === 'region' ? 'product' : 'region'}List`,
    }
    if (!checkboxController.checkValidate.call(elem, e, params)) return; // 检测是否只选择了一个
    checkboxModel[`${name}List`] = checkboxController.updateSelectedList(checkboxView[`${name}DOMLists`]); // 更新本地选择列表
    checkboxController.allSelect(checkboxView[`${name}DOMLists`], checkboxView[`${name}AllSelect`]) // 处理全选
    checkboxController.triggerUpdate()
  },
  checkValidate(e, { value, list_1, list_2 }) { // 第3步，检测是否能够更新列表，如果两个列表中只有一个数据，则阻止默认事件
    if (checkboxModel[list_1].length === 1 && checkboxModel[list_1].includes(value) && checkboxModel[list_2].length === 0) {
      return e.preventDefault()
    }
    return true;
  },
  updateSelectedList(dom) { // 第4步，更新本地被选列表
    let arr = dom.filter(item => item.checked);
    return arr.map(item => item.value)
  },
  allSelect(dom, allSelectDom) {
    let a = dom.every(item => item.checked);
    allSelectDom.checked = a ? true : false;
  },
  handleAllSelectClicked(e) {
    let elem = e.target;
    if (!elem.checked) return elem.checked = true;
    let name = checkboxModel.getLowercaseName(elem)
    let unclickedInputList = checkboxView[`${name}DOMLists`].filter(item => !item.checked)
    unclickedInputList.length !== 0 && unclickedInputList.forEach(item => item.click())
  },
  triggerUpdate() { // 第5步，根据本地列表筛选item并生成html，
    sourceData.forEach(item => chainSelectBoth.passRequest(item)) // 内嵌了generateDOM函数
    return checkboxController.updateDOM()
  },
  generateDOM(item) { // 传入筛选后的item，并生成html
    let saleHTML = '',
      html = checkboxModel.html;
    item.sale.forEach(s => saleHTML += `<td>${s}</td>`)
    function xx(l, name, one) {
      let s = ''
      if (checkboxModel.loopCount === 1) {
        s = `<td rowspan=${l}>${item[name]}</td>`
      }
      if (one) s = `<td>${item.product}</td>`;
      html += `
      <tr class="tr">
        ${s}
        <td>${item[`${name === 'region' ? 'product' : 'region'}`]}</td>
        ${saleHTML}
      </tr>
      `;
      checkboxModel.loopCount++;
    }
    if (checkboxModel.regionList.length === 1 && checkboxModel.productList.length > 1) {
      let l = checkboxModel.productList.length;
      xx(l, 'region')
    }
    if (checkboxModel.productList.length === 1 && checkboxModel.regionList.length > 1) {
      let l = checkboxModel.regionList.length;
      xx(l, 'product')
    }
    if (checkboxModel.regionList.length === 1 && checkboxModel.productList.length === 1) {
      xx(0, 'product', true)
    }
    if (checkboxModel.regionList.length > 1 && checkboxModel.productList.length > 1) {
      let l = checkboxModel.regionList.length;
      if (l < checkboxModel.loopCount) checkboxModel.loopCount = 1;
      xx(l, 'product')
    }
    return checkboxModel.html = html;
  },
  updateDOM() { // 最后一步，更新视图
    document.getElementById('tableWrapper').querySelector('tbody').innerHTML = checkboxModel.html;
    checkboxModel.loopCount = 1;
    return checkboxModel.html = ''; // 更新后还原checkboxModel.html
  },
}
// 绑定事件
checkboxController.bindEvent({ dom: checkboxView.regionCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
checkboxController.bindEvent({ dom: checkboxView.productCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
checkboxController.bindEvent({ dom: checkboxView.regionAllSelect, callback: checkboxController.handleAllSelectClicked })
checkboxController.bindEvent({ dom: checkboxView.productAllSelect, callback: checkboxController.handleAllSelectClicked })
// 职责链节点函数
let chainNodeFn = {
  bothSelect(item) {
    if (checkboxModel.regionList.includes(item.region) && checkboxModel.productList.includes(item.product)) return checkboxModel.html = checkboxController.generateDOM(item);
    return false;
  },
  selectRegion(item) {
    if (checkboxModel.regionList.includes(item.region) && !checkboxModel.productList.length) return checkboxModel.html = checkboxController.generateDOM(item);
    return false;
  },
  selectProduct(item) {
    if (checkboxModel.productList.includes(item.product) && !checkboxModel.regionList.length) return checkboxModel.html = checkboxController.generateDOM(item);
    return false;
  }
}
// 生成职责链
let chainSelectBoth = new Chain(chainNodeFn.bothSelect), chainSelectRegion = new Chain(chainNodeFn.selectRegion), chainSelectProduct = new Chain(chainNodeFn.selectProduct);
chainSelectBoth.setNextSuccessor(chainSelectRegion).setNextSuccessor(chainSelectProduct)