window.onload = function () {
  bindEvent()
  a.passRequest({ selectedProduct, selectedRegion })
}
let regionSelect = document.getElementById('regionSelect'),
  productSelect = document.getElementById('productSelect'),
  selectedRegion = regionSelect.value,
  selectedProduct = productSelect.value,
  html = '';

function selectRegion({ selectedProduct, selectedRegion }) {
  if (!(selectedRegion && !selectedProduct)) return false;
  sourceData.forEach(item => item.region === selectedRegion && (html = handleDOM(item)))
  return updateDOM()
}
function selectProduct({ selectedProduct, selectedRegion }) {
  if (!(selectedProduct && !selectedRegion)) return false;
  sourceData.forEach(item => item.product === selectedProduct && (html = handleDOM(item)))
  return updateDOM()
}
function bothSelect({ selectedProduct, selectedRegion }) {
  if (!(selectedRegion && selectedProduct)) return false;
  sourceData.forEach(item => item.region === selectedRegion && item.product === selectedProduct && (html = handleDOM(item)))
  return updateDOM()
}
function nullSelect({ selectedProduct, selectedRegion }) {
  if (!(!selectedProduct && !selectedRegion)) throw Error('搞什么飞机？什么神操作会走到这一步？')
  sourceData.forEach(item => html = handleDOM(item))
  return updateDOM()
}
class Chain {
  constructor(fn) {
    this.fn = fn;
    this.nextSuccessor = null;
  }
  setNextSuccessor(nextSuccessor) {
    return this.nextSuccessor = nextSuccessor;
  }
  passRequest() {
    let ret = this.fn.apply(this, arguments)
    if (ret === false) {
      return this.nextSuccessor && this.nextSuccessor.passRequest.apply(this.nextSuccessor, arguments)
    }
    return ret;
  }
}
let a = new Chain(bothSelect),
  b = new Chain(selectProduct),
  c = new Chain(selectRegion),
  n = new Chain(nullSelect);
a.setNextSuccessor(b).setNextSuccessor(c).setNextSuccessor(n)


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

function bindEvent() {
  regionSelect.addEventListener('change', e => {
    selectedRegion = e.target.value;
    a.passRequest({ selectedProduct, selectedRegion })
  })
  productSelect.addEventListener('change', e => {
    selectedProduct = e.target.value;
    a.passRequest({ selectedProduct, selectedRegion })
  })
}

