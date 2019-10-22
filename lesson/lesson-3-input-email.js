window.onload = function () {
  document.getElementById('email-input').focus()
}
class InputHandler {
  constructor() {
    this.postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
    this.input = document.getElementById('email-input'),
      this.ul = document.getElementById('email-sug-wrapper');
    this.isTyping = false,
      this.value = '',
      this.selectedLiIndex = 0;
    this.init()
  }
  init() {
    this.bindEvent()
  }
  bindEvent() {
    this.input.addEventListener('input', e => { this.inputHandler.call(this, e) })
    window.addEventListener('click', e => { this.clickHandler.call(this, e) })
    window.addEventListener('keyup', e => { this.escHandler.call(this, e) })
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
    return html;
  }
  handleInvalidateValue(e) {
    let value = e.target.value.trim().replace(/(^\s+)|(\s+$)|\s+/g, '');
    if (value === '') return this.removeActive();
    // 注意实体字符转码
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
  }
  removeActive(e) {
    this.ul.classList.remove('active')
    this.isTyping = false;
  }
  escHandler(e) {
    if (e.key === 'Escape') {
      this.removeActive()
      this.input.select()
    }
    if (this.isTyping) {
      if (e.key === 'ArrowDown') {
        this.selectedLiIndex++;
        if (this.selectedLiIndex === [...this.ul.children].length) {
          this.selectedLiIndex = 0;
        }
        this.handleLi(this.value)
      }
      if (e.key === 'ArrowUp') {
        this.selectedLiIndex--;
        if (this.selectedLiIndex < 0) {
          this.selectedLiIndex = [...this.ul.children].length - 1;
        }
        this.handleLi(this.value)
      }
      if (e.key === 'Enter') {
        this.input.value = [...this.ul.children][this.selectedLiIndex].textContent;
        this.removeActive()
      }
    }
  }
  clickHandler(e) {
    let target = e.target;
    if (target === this.input) return; // 点击自身
    let isClickLi = [...document.querySelectorAll('#email-sug-wrapper li')].some(li => li === target);
    // 实体字符的解码
    isClickLi && (this.input.value = target.textContent.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&'));
    this.removeActive()
    this.input.focus()
  }
}
new InputHandler()