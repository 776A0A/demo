let leftTemp = `
<div class="left-item">
  __icon__
  <span class="left-item-name">__name__</span>
</div>
`;
let rightTemp = `
<div class="right-item">
  <span class="price">__min_price__</span>
  <span class="choose-item">
    <button class="minus">-</button>
    <input type="number" class="goods-number-input" value="__value__">
    <button class="plus">+</button>
  </span>
</div>
`;
let cartControllerTemp = `
<div class="cart-left-part">
  <div class="shop-icon-wrapper">
    <img src="./img/shop-icon.png" class="shop-icon">
    <span class="red-icon">0</span>
  </div>
  <span>
    <span class="cart-price">￥0</span>
  </span>
</div>
<div class="cart-right-part">
  <button class="submit-button">去结算</button>
</div>
`;
let goodsItemTemp = `
<div class="cart-list-item">
  <span class="goods-name">__name__</span>
  <span class="goods-price">__min_price__</span>
  <span class="choose-item">
    <button class="minus">-</button>
    <input type="number" class="goods-number-input" value="__chosenNum__">
    <button class="plus">+</button>
  </span>
</div>
`