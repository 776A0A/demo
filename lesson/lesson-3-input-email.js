import utils from '../js/utils.js';
const { InputEmailHandler } = utils
window.onload = function () {
  document.getElementById('email-input').focus()
  new InputEmailHandler({
    dataList: ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'],
    input: document.getElementById('email-input'),
    ul: document.getElementById('email-sug-wrapper')
  })
}