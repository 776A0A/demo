window.onload = function () {
  document.getElementById('email-input').focus()
  new InputHandler()
}
class InputHandler {
  constructor() {
    this.postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
    this.input = document.getElementById('email-input'),
      this.ul = document.getElementById('email-sug-wrapper');
    this.isTyping = false,
      this.value = '', // input的value值
      this.selectedLiIndex = 0; // 提示框中选中的项的index
    this.bindEvent()
  }
  bindEvent() {
    this.input.addEventListener('input', e => { this.inputHandler.call(this, e) })
    window.addEventListener('click', e => { this.clickHandler.call(this, e) })
    window.addEventListener('keyup', e => { this.keyupHandler.call(this, e) })
  }
  inputHandler(e) {
    this.value = this.handleInvalidateValue(e);
    if (!this.value) return;
    this.isTyping = true;
    this.ul.classList.add('active')
    this.handleLi(this.value)
  }
  handleLi(value = '') {
    let html = '', _postfixList = this.postfixList;
    let afterAt = value.split('@')[1];
    let x = false;
    if (afterAt) {
      let regExp = new RegExp(`^${afterAt}`);
      if (!(_postfixList.every(item => !regExp.test(item)))) {
        _postfixList = [];
        this.postfixList.forEach(item => {
          if (regExp.test(item)) _postfixList.push(item.replace(afterAt, ''));
        })
      } else {
        x = true
      }
    }
    let s = `${value.split('@')[0]}@`;
    _postfixList.forEach(item => {
      html += `<li>${x ? s : value}${afterAt ? '' : '@'}${item}</li>`
    })
    this.ul.innerHTML = html;
    [...this.ul.querySelectorAll('li')][this.selectedLiIndex].classList.add('active')
  }
  handleInvalidateValue(e) { // 校验输入值是否有效
    let value = e.target.value.trim().replace(/(^\s+)|(\s+$)|\s+/g, '');
    if (value === '') return this.removeActive();
    // 注意实体字符转码
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
  }
  removeActive() {
    this.ul.classList.remove('active')
    this.isTyping = false;
  }
  keyupHandler(e) {
    if (e.key === 'Escape') return this.escHandler();
    if (!this.isTyping) return;
    if (e.key === 'ArrowDown') return this.arrowDownHandler()
    if (e.key === 'Enter') return this.enterHandler()
    if (e.key === 'ArrowUp') return this.arrowUpHandler()
  }
  escHandler() {
    this.removeActive()
    this.input.select()
  }
  arrowDownHandler() {
    this.selectedLiIndex++;
    if (this.selectedLiIndex === [...this.ul.children].length) this.selectedLiIndex = 0;
    this.handleLi(this.value)
  }
  arrowUpHandler() {
    this.selectedLiIndex--;
    if (this.selectedLiIndex < 0) this.selectedLiIndex = [...this.ul.children].length - 1;
    this.handleLi(this.value)
  }
  enterHandler() {
    this.input.value = [...this.ul.children][this.selectedLiIndex].textContent;
    this.removeActive()
  }
  clickHandler(e) {
    let target = e.target;
    if (target === this.input) return; // 点击input自身
    let isClickLi = [...document.querySelectorAll('#email-sug-wrapper li')].some(li => li === target);
    // 实体字符需解码
    isClickLi && (this.input.value = target.textContent.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&'));
    this.removeActive()
    this.input.focus()
  }
}