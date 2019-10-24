import utils from '../js/utils.js'
let { Chain } = utils;
window.onload = function () {
  checkboxController.triggerUpdate() // 初始化数据
}
let checkboxView = {
  regionCheckboxWrapper: document.getElementById('regionCheckbox'),
  productCheckboxWrapper: document.getElementById('productCheckbox'),
  regionDOMLists: [...document.getElementsByName('regionSelect')],
  productDOMLists: [...document.getElementsByName('productSelect')]
}
let checkboxModel = {
  regionList: ['华东'], // 已选的地区
  productList: [], // 已选的商品
  html: '' // 将要更新的视图html
}

let checkboxController = {
  bindEvent({ dom, callback, type = 'click' }, ...rest) { // 第1步，绑定事件
    dom.addEventListener(type, e => callback.call(e.target, e, ...rest))
  },
  handleCheckboxClickEvent(e) { // 第2步，根据不同name传入不同的参数
    let elem = e.target;
    if (elem.tagName.toLowerCase() !== 'input') return; // 会先点到label上
    let name = elem.name, regExp = new RegExp(/(.*)[A-Z]/);
    name = regExp.exec(name)[1]; // 拿到第一个大写字母之前的单词
    let params = {
      value: elem.value,
      list_1: `${name}List`,
      list_2: `${name === 'region' ? 'product' : 'region'}List`,
    }
    if (!checkboxController.checkValidate.call(elem, e, params)) return; // 检测是否只选择了一个
    checkboxModel[`${name}List`] = checkboxController.updateSelectedList(checkboxView[`${name}DOMLists`]); // 更新本地选择列表
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
  triggerUpdate() { // 第5步，根据本地列表筛选item并生成html，
    sourceData.forEach(item => chainSelectBoth.passRequest(item)) // 内嵌了generateDOM函数
    return checkboxController.updateDOM()
  },
  generateDOM(item) { // 传入筛选后的item，并生成html
    let saleHTML = '',
      html = checkboxModel.html;
    item.sale.forEach(s => saleHTML += `<td>${s}</td>`)
    html += `
      <tr>
        <td>${item.region}</td>
        <td>${item.product}</td>
        ${saleHTML}
      </tr>
    `;
    return checkboxModel.html = html;
  },
  updateDOM() { // 最后一步，更新视图
    document.getElementById('tableWrapper').querySelector('tbody').innerHTML = checkboxModel.html;
    return checkboxModel.html = ''; // 更新后还原checkboxModel.html
  },
}
// 绑定事件
checkboxController.bindEvent({ dom: checkboxView.regionCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
checkboxController.bindEvent({ dom: checkboxView.productCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
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