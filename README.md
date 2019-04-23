1. [new模拟](#new模拟)
2. [call模拟](#call模拟)
3. [bind模拟](#bind模拟)
4. [jsonp函数封装](#jsonp函数封装)
5. [二分查找的两种写法](#二分查找的两种写法)


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