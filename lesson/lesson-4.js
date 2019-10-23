window.onload = init;
function init() {
  xx({ selectedProduct, selectedRegion })
}
let regionSelect = document.getElementById('regionSelect'),
  productSelect = document.getElementById('productSelect')
let selectedRegion = regionSelect.value, html = '';
let selectedProduct = productSelect.value;
regionSelect.addEventListener('change', e => {
  let value = e.target.value;
  if (!value) return;
  selectedRegion = value;
  xx({ selectedProduct, selectedRegion })
})
productSelect.addEventListener('change', e => {
  selectedProduct = e.target.value;
  xx({ selectedProduct, selectedRegion })
})
let selectStrategies = {
  selectProduct({ selectedProduct }) {

  }
}
function xx({ selectedProduct, selectedRegion }) {
  if (selectedRegion && selectedProduct) {
    sourceData.forEach(item => {
      if (item.region === selectedRegion && item.product === selectedProduct) {
        html = handleDOM(item)
      }
    })
    return updateDOM()
  }
  if (selectedRegion && !selectedProduct) {
    sourceData.forEach(item => {
      if (item.region === selectedRegion) {
        html = handleDOM(item)
      }
    })
    return updateDOM()
  }
  if (selectedProduct && !selectedRegion) {
    sourceData.forEach(item => {
      if (item.product === selectedProduct) {
        html = handleDOM(item)
      }
    })
    return updateDOM()
  }
}

function updateDOM() {
  let tableWrapper = document.getElementById('tableWrapper')
  tableWrapper.querySelector('tbody').innerHTML = html;
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
  return html
}