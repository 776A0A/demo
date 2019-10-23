import utils from '../js/utils.js'
let { Chain } = utils;
let selectForm = document.getElementById('selectForm');
let regionList = [],
  productList = [],
  html = '';
selectForm.addEventListener('change', function (e) {
  let name = e.target.name;
  if (name === 'regionSelect') regionList = updateSelectedList(this.regionSelect);
  if (name === 'productSelect') productList = updateSelectedList(this.productSelect);
  triggerUpdate()
})
function triggerUpdate() {
  sourceData.forEach(item => chainSelectBoth.passRequest(item))
  return updateDOM()
}

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


