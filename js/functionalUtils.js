// 特定功能性函数
const _ = id => document.getElementById(id);
const __ = className => document.getElementsByClassName(className);
const functionalUtils = {
  /**
   * 在页面中添加打星评分功能
   * 所选的星星的编号 index 将存在包裹元素的 dataset 上
   * @param {number} total 每排所需要的星星
   * @param {string} id 包裹元素的 id，注意包裹元素必须为空，否则星星编号会出现差错
   * @param {string} image_1 需要替换的图片路径
   * @param {string} image_2 需要替换的图片路径
  */
  Stars: class {
    setBaseImage(...rest) { // 用于指定默认图片
      if (rest.length > 2) throw Error('只能传入两张图片！');
      this.image_1 = rest[0];
      this.image_2 = rest[1];
      this.initImage = true; // 用于标记是否使用过设置默认图片
    }
    add({ id, total = 5, image_1, image_2 }) { // 生成 stars
      this.total = total;
      this.id = id;
      if (!this.initImage) {
        this.image_1 = image_1;
        this.image_2 = image_2;
      }
      this.renderHTML()
      this.clickStar(); // 添加点击事件
    }
    renderHTML() {
      this.wrapper = _(this.id); // 包裹元素
      this.prevClickedElem = new WeakMap(); // 用于存储用户上一次点击的元素
      let template = `<img src=${this.image_1} alt="star" class="star">`; // 基本模板
      let html = template;
      for (let i = 1; i < this.total; i++) { html += template; }
      wrapper.style.cssText += `display: flex;align-items: center;position: relative;`; // 包裹元素的基本样式
      this.wrapper.innerHTML = html;
      let stars = [...__('star')];
      // 星星的大小
      stars.forEach(img => { img.style.width = '10%'; })
    }
    clickStar() {
      let { wrapper, image_1, image_2 } = this;
      wrapper.addEventListener('click', e => {
        let ELEM = e.target;
        if (ELEM.tagName !== 'IMG') return;
        let index = [...wrapper.children].findIndex(item => item === ELEM) // 当前点击元素在同级元素中的 index
        let currentElem = e.target;
        if (ELEM.src === image_1) {
          let _currentElem = e.target;
          _currentElem.src = image_2;
          while (currentElem = currentElem.previousSibling) { currentElem.src = image_2; }
          while (_currentElem = _currentElem.nextSibling) { _currentElem.src = image_1; }
          wrapper.dataset.starIndex = index + 1; // 将用户点击的星星的编号存入包裹元素的dataset上
        } else {
          if (this.prevClickedElem.get(wrapper) === ELEM) {
            [...wrapper.children].forEach(item => item.src = image_1)
            wrapper.dataset.starIndex = '';
          } else {
            while (currentElem = currentElem.nextSibling) {
              currentElem.src = image_1;
              wrapper.dataset.starIndex = index + 1;
            }
          }
        }
        this.prevClickedElem.set(wrapper, ELEM) // 更新上次点击的星星
      })
    }
  },
  /**
   * 图片上传功能并实现预览和点击图片放大
   * @param {string} className 最外层包裹元素的类名，最好为空
   * @param {string} blankImage 默认显示的图片
   * @param {string} url 上传图片的接口
   * @param {boolean} needPlusImage 是否需要添加点击图片放大功能，默认true
   */
  UploadImage: class {
    constructor({ className, blankImage, url, needPlusImage = true }) {
      this.className = className;
      this.blankImage = blankImage;
      this.url = url;
      this.wrapperArr = [...__(this.className)];
      this.needPlusImage = needPlusImage;
      this.plusImageInstance = null; // 如果needPlusImage为true，上传照片后就会生成实例
      this.hasPlusImageInstance = false; // 避免多次初始化放大图片实例
      this.renderHTML()
    }
    renderHTML() {
      let input = `
        <!-- 占位用，方便上传图片后添加到此位置 -->
        <img class="uploadedImage" src=${this.blankImage} alt="uploadedImage" style="display: none;"> 
        <div id="blank-image">
          <input type="file" name="" id="uploadImageInput" accept="image/*">
          <img src="${this.blankImage}" alt="图片" class="blank-image">
        </div>
      `;
      this.setHeadStyle() // 在头部设置样式
      this.wrapperArr.forEach(elem => {
        elem.innerHTML += input;
        elem.style.cssText += `display: flex; align-items: center; display: flex; align-items: center; font-size: 0; flex-flow: row wrap;`;
        this.setImgStyle()
        this.addClickEventToUpload(elem)
      })
    }
    setHeadStyle() {
      let head = document.getElementsByTagName('head')[0];
      let style = document.createElement('style');
      style.innerHTML = `
        *{ padding: 0; margin: 0; box-sizing: border-box; }
        #blank-image { position: relative; }
        #blank-image [type="file"] { outline: none; background-color: none; border: none; width: 100%; height: 100%; position: absolute; opacity: 0; }
        #blank-image img.blank-image { margin: 0.5rem; margin-left: 0; }
      `;
      head.appendChild(style)
    }
    setImgStyle() {
      let imgs = [...document.querySelectorAll(`.${this.className} img`)];
      imgs.forEach(img => { img.style.cssText += `width: 5rem; height: 5rem; margin: .5rem; margin-left: 0;`; })
    }
    addClickEventToUpload(elem) {
      let clickToUpload = _('uploadImageInput');
      clickToUpload.addEventListener('change', e => {
        let { newImgElem, image } = this.createImage(e);
        let uploadedImage = __('uploadedImage')[0];
        elem.insertBefore(newImgElem, uploadedImage)
        this.uploadAction(image)
      })
    }
    createImage(e) {
      let image = e.currentTarget.files[0];
      if (!image) return;
      let imageUrl = URL.createObjectURL(image); // 此种方式可以获取一个可显示的url
      let newImgElem = document.createElement('img');
      newImgElem.classList.add('uploadedImage')
      newImgElem.src = imageUrl;
      newImgElem.setAttribute('alt', 'uploadedImage')
      newImgElem.style.cssText += `width: 5rem; height: 5rem; margin: .5rem; margin-left: 0;`;
      return { newImgElem, image };
    }
    uploadAction(image) {
      if (this.needPlusImage && !this.hasPlusImageInstance) {
        let ClickToPlusImage = utils.ClickToPlusImage;
        this.plusImageInstance = new ClickToPlusImage(this.className)
        this.hasPlusImageInstance = true;
      }
      // let file = new File()
      // file.append('image', image)
      // fetch(this.url, {
      //   method: 'POST',
      //   body: file
      // }).then(res => {
      //   if (res.ok) {

      //   } else {

      //   }
      // }).catch(err => { })
    }
  },
  /**
   * 点击图片放大，传入包裹元素的className，其内部的所有img标签都可点击放大
   * @param {string} wrapperClassName 图片列表外层的包裹元素
   */
  ClickToPlusImage: class {
    constructor(wrapperClassName) {
      this.wrapperClassName = wrapperClassName;
      this.init()
    }
    init() {
      this.setHeadStyle()
      this.addPreviewElem()
      this.clickEvent()
      this.setPreviewClickEvent()
    }
    setHeadStyle() {
      let head = document.getElementsByTagName('head')[0]
      let style = document.getElementById('previewImgStyle');
      if (style) return;
      style = document.createElement('style');
      style.id = 'previewImgStyle';
      // 预览图的样式
      style.innerHTML = `
        #preview {position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: #000; display: none; transition: opacity .5s ease; opacity: 0; z-index: 999;}
        #fullImage {position: absolute; width: 100%; top: 50%; transform: translateY(-50%);}
      `;
      head.appendChild(style)
    }
    addPreviewElem() {
      let preview = document.getElementById('preview');
      if (preview) return;
      preview = document.createElement('div');
      preview.setAttribute('id', 'preview')
      let body = document.getElementsByTagName('body')[0]
      body.appendChild(preview)
      this.preview = preview;
    }
    clickEvent() {
      let wrapper = __(this.wrapperClassName);
      [...wrapper].forEach(item => { // 为每个包裹元素添加点击事件
        item.addEventListener('click', e => {
          let clickedElem = e.target;
          if (clickedElem.tagName !== 'IMG') return;
          this.setDisplayImageToPreview(clickedElem)
        })
      })
    }
    setDisplayImageToPreview(img) {
      let preview = this.preview;
      preview.innerHTML = `<img src=${img.src} id="fullImage" />`;
      preview.style.display = 'block';
      setTimeout(() => { preview.style.opacity = '1' }, 0) // 渐变
    }
    setPreviewClickEvent() {
      let preview = this.preview;
      preview.addEventListener('click', e => {
        preview.style.opacity = '0';
        setTimeout(() => {
          preview.style.display = 'none';
          preview.innerHTML = '';
        }, 500);
      })
    }
  },
  /**
   * 下滑到一定距离自动加载数据
   * @param {string} url 请求的地址
   * @param {object} data 传入的数据
   */
  SlideToLoadMore: class {
    constructor(url, data) {
      this.url = url;
      this.data = data;
      this.init()
    }
    init() {
      document.addEventListener('scroll', this.loadMore)
    }
    loadMore() {
      let { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      let res = scrollHeight - scrollTop - clientHeight;
      if (res < 500) {
        // return fetch(url, {
        //   method: 'POST',
        // })
      }
    }
  },
  /**
   * email输入框，带提示功能
   * @param {array} dataList 提示框内容
   * @param {dom} input 
   * @param {dom} ul 
   */
  InputEmailHandler: class {
    constructor({ dataList, input, ul }) {
      this.dataList = dataList;
      this.input = input,
        this.ul = ul;
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
      let html = '', _dataList = this.dataList;
      let afterAt = value.split('@')[1];
      let x = false;
      if (afterAt) {
        let regExp = new RegExp(`^${afterAt}`);
        if (!(_dataList.every(item => !regExp.test(item)))) { // dataList里的内容至少有一项匹配@后面的内容
          _dataList = [];
          this.dataList.forEach(item => {
            if (regExp.test(item)) _dataList.push(item.replace(afterAt, ''));
          })
        } else {
          x = true;
        }
      }
      let s = `${value.split('@')[0]}@`;
      _dataList.forEach(item => html += `<li>${x ? s : value}${afterAt ? '' : '@'}${item}</li>`)
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
  },
  /**
  * 倒计时
  * @param {number} time 倒计时时间
  * @param {dom} resultDom 展示倒计时的dom元素
  * @param {string} timeType 倒计时类型
  * @returns object
  */
  TimeCounter: class {
    constructor(time, resultDom, timeType) {
      this.time = time; // 倒计时时间
      this.resultDom = resultDom; // 展示倒计时的dom元素
      this.timeType = timeType; // 倒计时类型
      this.intervalId = null;
      this.typeObj = {
        '小时': 60 * 1000 * 60,
        '分': 60 * 1000,
        '秒': 1000
      };
      this.init()
    }
    init() {
      this.time = this.time < 0 ? 0 : this.time;
      this.time = this.typeObj[this.timeType] * this.time; // 根据不同的计时类型计算时间
      this.setTimeCount()
    }
    setTimeCount() {
      if (this.intervalId) clearInterval(this.intervalId); // 清除上一个倒计时
      this.run(this.time) // 开始倒计时
      this.intervalId = setInterval(() => this.run(), 1000);
    }
    run() {
      result.textContent = this.formatTime(); // 更新页面倒计时
      if (this.time === 0) return clearInterval(this.intervalId)
      this.time -= 1000;
    }
    formatTime() {
      let hours = Math.trunc(this.time / 1000 / 60 / 60),
        _min = Math.trunc(this.time / 1000 / 60),
        min = _min >= 60 ? (_min % 60) : (_min),
        sec = (this.time / 1000) % 60;
      hours = this.add0(hours), min = this.add0(min), sec = this.add0(sec);
      return `${hours}:${min}:${sec}`;
    }
    add0(t) {
      return t < 10 ? `0${t}` : t;
    }
  },
}
export default functionalUtils;