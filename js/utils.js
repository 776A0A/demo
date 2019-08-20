let prevClickedElem = new WeakMap(); // 用以记录上一次点击的星星
let clickedStar = new Map(); // 用以记录最终选择的星星
let whiteStar = './images/xx1.png';
let redStar = './images/xx2.png';
function stars(total, wrapperId) {
  if (total === 0) return;
  let template = `<img src=${whiteStar} alt="star">`;
  let html = template
  for (let i = 1; i < total; i++) {
    html += template;
  }
  let wrapper = document.getElementById(wrapperId);
  wrapper.style.cssText += `display: flex;align-items: center;position: relative;`;

  let _html = wrapper.innerHTML;
  wrapper.innerHTML = _html + html;
  [...wrapper.children].forEach(img => {
    img.style.width = '10%';
  })
  clickStar(wrapperId);
}
function clickStar(wrapperId) {
  let wrapper = document.getElementById(wrapperId);
  wrapper.addEventListener('click', e => {
    let ELEM = e.target;
    let _currentElem = e.target;
    let currentElem = e.target;
    if (currentElem.tagName !== 'IMG') return;
    let currentSrc = currentElem.getAttribute('src');
    if (currentSrc === whiteStar) {
      _currentElem.setAttribute('src', redStar)
      while (currentElem = currentElem.previousSibling) {
        currentElem.setAttribute('src', redStar)
      }
      while (_currentElem = _currentElem.nextSibling) {
        _currentElem.setAttribute('src', whiteStar)
      }
      clickedStar.set(wrapper, ELEM)
    } else {
      if (prevClickedElem.get(wrapper) === ELEM) {
        [...ELEM.parentNode.children].forEach(item => {
          item.setAttribute('src', whiteStar)
        })
        clickedStar.set(wrapper, null)
      } else {
        while (_currentElem = _currentElem.nextSibling) {
          _currentElem.setAttribute('src', whiteStar)
          clickedStar.set(wrapper, ELEM)
        }
      }
    }
    prevClickedElem.set(wrapper, ELEM) // 更新星星
    let index = [...wrapper.children].findIndex(item => item === ELEM)
    wrapper.dataset.starIndex = index; // 将用户点击的星星的编号存入包裹元素的dataset上
  })
} 

export default stars;