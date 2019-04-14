1. [new模拟](#new模拟)
2. [call模拟](#call模拟)
3. [bind模拟](#bind模拟)
4. [jsonp函数封装](#jsonp函数封装)


#### new模拟
```javascript

function new2(fn) {
    // fn实则为构造器函数
    if (!(fn instanceof Function)) throw Error('not a function!')
    // 继承构造器函数原型
    let obj = Object.create(fn.prototype);
    // 获取剩余参数
    let args = [...arguments].slice(1);
    // 改变fn内的this指向，使得obj生成一些私有属性
    let res = fn.apply(obj, args);
    // 判断res，如果为object，则直接返回，效果和new操作符一样
    return res instanceof Object ? res : obj;
}

```

#### call模拟
```javascript

// 具体思路是使用对象方法的调用方式，this绑定将直接绑定到对象上
// 模拟apply只是内部传参的类型不同
Function.prototype.call2 = function(obj = window) {
    // 获取调用函数
    obj.fn = this;
    // 剩余参数
    let args = [...arguments].slice(1);
    // 保留函数返回值
    let res = obj.fn(...args);
    // 调用后删除
    delete context.fn;
    return res;
}

```

#### bind模拟
```javascript

// bind并非立即调用，会返回一个绑定this后的函数
// 如果对返回函数使用new操作符，那么this将重新绑定在new返回的对象上
Function.prototype.bind2 = function(obj) {
    if (!(this instanceof Function)) throw Error('not a function!')
    // 获取调用函数
    let thisFn = this;
    // 剩余参数
    let args = [...arguments].slice(1);
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