[JS相关](#JS相关)
1. [new模拟](#new模拟)
2. [call模拟](#call模拟)
3. [bind模拟](#bind模拟)
4. [jsonp函数封装](#jsonp函数封装)
5. [二分查找的两种写法](#二分查找的两种写法)

[CSS&HTML相关](#CSS&HTML相关)
1. [显示省略号](#显示省略号)
2. [点击显示二级下拉菜单及遮罩层](#点击显示二级下拉菜单及遮罩层)
3. [toast弹窗](#toast弹窗)
4. [布局相关](#布局相关)
5. [样式重置](#样式重置)
6. [通用媒体查询](#通用媒体查询)
7. [全屏背景、内容垂直居中、强制出现垂直滚动条、CSS固定页脚](#全屏背景、内容垂直居中、强制出现垂直滚动条、CSS固定页脚)
8. [@font-face模板](#@font-face模板)
9. [基于文件类型的链接样式](#基于文件类型的链接样式)

----------------------------------------------------------------------------------
### JS相关

#### new模拟
```javascript
function new2(fn) { // 将fn当成构造函数
    if (!(fn instanceof Function)) throw Error('not a function!')
    let obj = Object.create(fn.prototype); // 继承构造器函数原型
    let args = [...arguments].slice(1); // 获取剩余参数
    let res = fn.apply(obj, args); // 改变fn内的this指向，使得obj生成一些私有属性
    return res instanceof Object ? res : obj; // 判断res，如果为object，则直接返回，效果和new操作符一样
}
```

#### call模拟
```javascript
// 具体思路是使用对象方法的调用方式，this绑定将直接绑定到对象上
// 模拟apply只是内部传参的类型不同
Function.prototype.call2 = function(obj = window) {
    obj.fn = this; // this为函数。为obj添加方法，这样使用对象方法调用法this的取值就是obj了，相当于将this值绑定在了obj
    let args = [...arguments].slice(1); // 剩余参数
    let res = obj.fn(...args); // 保留函数返回值
    delete obj.fn; // 调用后删除
    return res;
}
```

#### bind模拟
```javascript
// bind并非立即调用，会返回一个绑定this后的函数
// 如果对返回函数使用new操作符，那么this将重新绑定在new返回的对象上
Function.prototype.bind2 = function(obj) {
    let thisFn = this; // 获取调用函数
    let args = [...arguments].slice(1); // 剩余参数
    let FnBound = function() {
        // 关键一步，判断是否使用new操作符
        // 函数柯里化，将先传入的参数与后传入的参数拼接
        return thisFn.apply(this instanceof FnBound ? this : obj, [...args, ...arguments]);
    }
    // 遵从bind，将返回函数的原型绑定为调用函数的原型，使用Object.create创建的实例作为中转站
    FnBound.prototype = Object.create(thisFN.prototype);
    return FnBound;
}
```

#### jsonp函数封装
```javascript
function jsonp(url, params = {}, cb) {
    // 随机的回调函数名字，避免缓存问题
    let cbName = `jsonp_${(Math.random()*Math.random())}`;
    window[cbName] = function(data) {
        cb(data)
        document.body.removeChild(scriptEle)
    }
    // 查询参数
    let queryStr = '';
    for (let key in params) {
        queryStr += `${key}=${params[key]}&`;
    }

    url += `?${queryStr}callback=${cbName}`;

    let scriptEle = document.createElement('script');
    scriptEle.src = url;
    document.body.appendChild(scriptEle)
}
```

#### 二分查找的两种写法
```javascript
// 有序数组中查找相应value的key
function binarySearch_1(arr, value) {
	let low = 0,
		high = arr.length - 1;
	while (low <= high) {
		let mid = parseInt((low + high) / 2);
		if (mid === arr[mid]) {
			return mid;
		} else if (value < arr[mid]) { // 折半
			high = mid + 1;
		} else if (value > arr[mid]) { // 折半
			low = mid - 1;
		} else {
			return -1;
		}
	}
}
function binarySearch_2(arr, value, high, low = 0) {
	let high = high || arr.length - 1,
		mid = parseInt((low + high) / 2);
	if (value === arr[mid]) {
		return mid;
	} else if (value < arr[mid]) { // 折半
		high = mid + 1;
	} else if (value > arr[mid]) { // 折半
		low = mid - 1
	} else {
		return -1;
	}

}
```

### CSS&HTML相关

#### 显示省略号
```css
/* 单行文本显示... */
p {
    text-overflow: ellipsis;
    white-space: wrap;
    overflow: hidden;
}
/* 多行文本显示... */
P {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
```

#### 点击显示二级下拉菜单及遮罩层

通过JS改变相应的class
```css

ul {
    position: absolute;
    /* 相对于顶部导航栏的位移 */
    top: 52px;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff;
    transform: translateY(calc(-100%));
}
ul.show {
    transform: translateY(0);
}
.mask {
    position: fixed;
    /* 占满屏幕 */
    top: 52px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 999;
    display: none;
}
.mask.show {
    display: block;
}

```
可以通过JS在弹出mask后禁止触摸滑动，mask消失后恢复滑动
```javascript
document.addEventListener('touchmove', (e) =>{ e.preventDefault() }, { passive: false })
```

#### toast弹窗

包裹一个外层元素，使用JS切换显示与否
```css
.mask_2 {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background-color: rgba(0, 0, 0, .6);
    z-index: 100000;
}

.toast {
    position: fixed;
    /* 居中 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100001;
    background-color: #fff;
    padding-top: 20px;
    border-radius: 10px;
    text-align: center;
    width: 76%;
}
```

#### 布局相关

![](https://raw.githubusercontent.com/776A0A/demo/master/images/%E5%B8%83%E5%B1%80.png)
```html
<div class="icon">
    <a class="call">
        <img src="../../../images/dh@2x.png" alt="电话icon">
    </a>
    <a class="call">
        <img src="../../../images/dw@2x.png" alt="定位icon">
    </a>
</div>
```
```css
.icon {
    float: right;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    /* 实现两个icon在两边 */
    top: 0;
    bottom: 0;
    right: 15px;
}
.icon a:nth-child(1) {
    margin-top: 15px;
}
.icon a:nth-child(2) {
    margin-bottom: 15px;
}
.icon a {
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, .3);
    padding: 15px;
    text-align: center;
    border-radius: 50%;
    position: relative;
}
.icon a img {
    width: 40%;
    display: inline-block;
    position: absolute;
    /* 居中 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

#### 样式重置
```css
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  outline: none;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
html { height: 101%; }
body { font-size: 62.5%; line-height: 1; font-family: Arial, Tahoma, sans-serif; }
article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; }
ol, ul { list-style: none; }
blockquote, q { quotes: none; }
blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; }
strong { font-weight: bold; } 
table { border-collapse: collapse; border-spacing: 0; }
img { border: 0; max-width: 100%; }
p { font-size: 1.2em; line-height: 1.0em; color: #333; }
```

#### 通用媒体查询
```css
/* Smartphones (portrait and landscape) ----------- */
@media only screen 
and (min-device-width : 320px) and (max-device-width : 480px) {
  /* Styles */
}

/* Smartphones (landscape) ----------- */
@media only screen and (min-width : 321px) {
  /* Styles */
}

/* Smartphones (portrait) ----------- */
@media only screen and (max-width : 320px) {
  /* Styles */
}

/* iPads (portrait and landscape) ----------- */
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) {
  /* Styles */
}

/* iPads (landscape) ----------- */
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape) {
  /* Styles */
}

/* iPads (portrait) ----------- */
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait) {
  /* Styles */
}

/* Desktops and laptops ----------- */
@media only screen and (min-width : 1224px) {
  /* Styles */
}

/* Large screens ----------- */
@media only screen and (min-width : 1824px) {
  /* Styles */
}

/* iPhone 4 ----------- */
@media only screen and (-webkit-min-device-pixel-ratio:1.5), only screen and (min-device-pixel-ratio:1.5) {
  /* Styles */
}
```

#### 全屏背景、内容垂直居中、强制出现垂直滚动条、CSS固定页脚
```css
/* 全屏背景 */
html { 
    background: url('images/bg.jpg') no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
```

```css
/* 内容垂直居中 */
.container {
    min-height: 6.5em;
    display: table-cell;
    vertical-align: middle;
}
```

```css
/* 强制出现垂直滚动条 */
html { height: 101% }
```

```css
/* CSS固定页脚 */
#footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    height: 30px;
    width: 100%;
    background: #444;
}
```

#### @font-face模板
```css
@font-face {
    font-family: 'MyWebFont';
    src: url('webfont.eot'); /* IE9 Compat Modes */
    src: url('webfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('webfont.woff') format('woff'), /* Modern Browsers */
    url('webfont.ttf')  format('truetype'), /* Safari, Android, iOS */
    url('webfont.svg#svgFontName') format('svg'); /* Legacy iOS */
}

body {
    font-family: 'MyWebFont', Arial, sans-serif;
}
```

#### 基于文件类型的链接样式
```css
/* external links */
a[href^="http://"] {
    padding-right: 13px;
    background: url('external.gif') no-repeat center right;
}

/* emails */
a[href^="mailto:"] {
    padding-right: 20px;
    background: url('email.png') no-repeat center right;
}

/* pdfs */
a[href$=".pdf"] {
    padding-right: 18px;
    background: url('acrobat.png') no-repeat center right;
}
```