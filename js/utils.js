const utils = {
  /**
   * 在页面中添加打星功能
   * 所选的星星的编号 index 将存在包裹元素的 dataset 上
   * @param {number} total 每排所需要的星星
   * @param {string} id 包裹元素的 id，注意包裹元素必须为空，否则星星编号会出现差错
   * @param {string} image_1 需要替换的图片路径
   * @param {string} image_2 需要替换的图片路径
  */
  Stars: class {
    baseImagePath(...rest) {
      if (rest.length > 2) throw Error('只能传入两张图片！');
      let [image_1, image_2] = rest;
      this.image_1 = image_1;
      this.image_2 = image_2;
      this.initImage = true; // 用于标记是否使用过设置默认图片
    }
    add({ id, total = 5, image_1, image_2 }) { // 生成 stars
      this.total = total;
      this.id = id;
      if (!this.initImage) {
        this.image_1 = image_1;
        this.image_2 = image_2;
      }
      this.wrapper = document.getElementById(id);
      this.prevClickedElem = new WeakMap(); // 用于存储用户上一次点击的元素
      let template = `<img src=${this.image_1} alt="star" class="star">`; // 基本模板
      let html = template;
      for (let i = 1; i < total; i++) {
        html += template;
      }
      let wrapper = this.wrapper;
      wrapper.style.cssText += `display: flex;align-items: center;position: relative;`; // 包裹元素的基本样式
      wrapper.innerHTML = html;

      let stars = [...document.getElementsByClassName('star')];
      stars.forEach(img => { // 星星的基本大小
        img.style.width = '10%';
      })

      this.clickStar(); // 添加点击事件
    }
    clickStar() {
      let { wrapper, image_1, image_2 } = this;
      wrapper.addEventListener('click', e => {
        let ELEM = e.target;
        if (ELEM.tagName !== 'IMG') return;
        let index = [...wrapper.children].findIndex(item => item === ELEM) // 当前点击元素在同级元素中的 index
        let currentSrc = ELEM.getAttribute('src');
        let currentElem = e.target;
        if (currentSrc === image_1) {
          let _currentElem = e.target;
          _currentElem.setAttribute('src', image_2)
          // TODO 在处理这个的时候能不能封装个函数？
          while (currentElem = currentElem.previousSibling) {
            currentElem.setAttribute('src', image_2)
          }
          while (_currentElem = _currentElem.nextSibling) {
            _currentElem.setAttribute('src', image_1)
          }
          wrapper.dataset.starIndex = index + 1; // 将用户点击的星星的编号存入包裹元素的dataset上
        } else {
          if (this.prevClickedElem.get(wrapper) === ELEM) {
            [...wrapper.children].forEach(item => {
              item.setAttribute('src', image_1)
            })
            wrapper.dataset.starIndex = '';
          } else {
            while (currentElem = currentElem.nextSibling) {
              currentElem.setAttribute('src', image_1)
              wrapper.dataset.starIndex = index + 1;
            }
          }
        }
        this.prevClickedElem.set(wrapper, ELEM) // 更新星星
      })
    }
  },
  _uploadImage: class {
    constructor(className, blankImage, url) {
      this.className = className;
      this.blankImage = blankImage;
      this.url = url;
    }
    init() {
      let wrapper = [...document.getElementsByClassName(this.className)];
      let input = `
      <img class="uploadedImage" src="./images/plain.png" alt="uploadedImage" style="display: none;"> 
      <div id="blank-image">
        <input type="file" name="" id="uploadImage" accept="image/*">
        <img src="${this.blankImage}" alt="图片" class="blank-image">
      </div>
    `;
    }
  },
  /**
   * 图片上传功能并实现预览和点击图片放大
   * @param {*} className 包裹元素的类名
   * @param {*} blankImage 默认显示的图片
   * @param {*} url 上传图片的接口
   */
  uploadImage(className, blankImage, url) {
    let wrapper = [...document.getElementsByClassName(className)];
    let input = `
      <img class="uploadedImage" src="./images/plain.png" alt="uploadedImage" style="display: none;"> 
      <div id="blank-image">
        <input type="file" name="" id="uploadImage" accept="image/*">
        <img src="${blankImage}" alt="图片" class="blank-image">
      </div>
    `;
    wrapper.forEach(elem => {
      elem.innerHTML = input;
      elem.style.cssText += `display: flex; align-items: center; display: flex; align-items: center; font-size: 0; flex-flow: row wrap;`;
      let imgs = [...document.querySelectorAll(`.${className} img`)];
      imgs.forEach(img => {
        img.style.cssText += `width: 5rem; height: 5rem; margin: .5rem; margin-left: 0;`;
      })
      let clickToUpload = document.getElementById('uploadImage');
      clickToUpload.addEventListener('change', e => {
        let image = e.currentTarget.files[0];
        let imageUrl = URL.createObjectURL(image);
        let newImg = document.createElement('img');
        newImg.classList.add('uploadedImage')
        newImg.src = imageUrl;
        newImg.setAttribute('alt', 'uploadedImage')
        newImg.style.cssText += `width: 5rem; height: 5rem; margin: .5rem; margin-left: 0;`;
        newImg.addEventListener('click', e => {
          let preview = document.getElementById('preview');
          let elem = e.currentTarget;
          preview.innerHTML = `<img src=${elem.src}  id="fullImage" />`;
          preview.style.display = 'block';
          let fullImage = document.getElementById('fullImage')
          fullImage.style.cssText += `position: absolute; width: 100%; top: 50%; transform: translateY(-50%); max-height: 100%;`
          function handlePreviewClick(e) {
            preview.style.display = 'none';
            preview.removeEventListener('click', handlePreviewClick)
          }
          preview.addEventListener('click', handlePreviewClick)
        })
        let uploadedImage = document.getElementsByClassName('uploadedImage')[0];
        elem.insertBefore(newImg, uploadedImage)
        // let file = new File()
        // file.append('image', image)
        // fetch(url, {
        //   method: 'POST',
        //   body: file
        // }).then(res => {
        //   if (res.ok) {

        //   } else {

        //   }
        // }).catch(err => { })
      })
    })
  },
  /**
   * 点击图片放大
   * @param {*} id 图片列表外层的包裹元素 id
   * @param {*} previewId 预览图的 wrapper
   */
  fullScreen(id, previewId) {
    let preview = document.getElementById(previewId);
    let wrapper = document.getElementById(id);
    wrapper.addEventListener('click', e => {
      let img = e.target;
      if (img.tagName !== 'IMG') return;
      preview.innerHTML = `<img src=${img.src} id="fullImage" />`;
      preview.style.display = 'block';
      let displayImage = document.getElementById('fullImage');
      displayImage.style.cssText += `position: absolute; width: 100%; top: 50%; transform: translateY(-50%);`
      preview.addEventListener('click', handlePreviewClick)
    })
    function handlePreviewClick(e) {
      preview.style.display = 'none';
      preview.removeEventListener('click', handlePreviewClick)
    }
  }
}

export default utils