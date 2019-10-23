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
window.onload = function () {
  bindEvent()
  chainBothSelect.passRequest({ selectedProduct, selectedRegion })
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
function nullSelect() {
  sourceData.forEach(item => html = handleDOM(item))
  return updateDOM()
}

let selectForm = document.getElementById('selectForm')
let regionList = productList = []
selectForm.addEventListener('change', function (e) {
  let target = e.target,
    name = target.name;
  if (name === 'regionSelect') {
    regionList = handleSelectedList(this.regionSelect);
    xx()
  }
  if (name === 'productSelect') {
    productList = handleSelectedList(this.productSelect);
    xx()
  }
})
function xx() {
  sourceData.forEach(item => {
    if (regionList.includes(item.region) && productList.includes(item.product)) {
      html = handleDOM(item)
    }
    if (regionList.includes(item.region) && !productList.includes(item.product)) {
      html = handleDOM(item)
    }
    if (!regionList.includes(item.region) && productList.includes(item.product)) {
      html = handleDOM(item)
    }
  })
  return updateDOM()
}


















// --------------------------------------------------------------------------
function handleSelectedList(domList) {
  let arr = [...domList].filter(item => item.checked);
  return arr.map(item => item.value)
}
let chainBothSelect = new Chain(bothSelect),
  chainSelectProduct = new Chain(selectProduct),
  chainSelectRegion = new Chain(selectRegion),
  chainNullSelect = new Chain(nullSelect);
chainBothSelect.setNextSuccessor(chainSelectProduct).setNextSuccessor(chainSelectRegion).setNextSuccessor(chainNullSelect)

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
    chainBothSelect.passRequest({ selectedProduct, selectedRegion })
  })
  productSelect.addEventListener('change', e => {
    selectedProduct = e.target.value;
    chainBothSelect.passRequest({ selectedProduct, selectedRegion })
  })
}

