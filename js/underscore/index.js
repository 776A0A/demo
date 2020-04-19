/**
 * _ 是一个函数，同时挂载有许多方法
 * 可以直接使用_.xx调用方法
 * 也可以_('xx')调用函数，返回一个对象，该对象的原型上挂在了 _ 上的方法
 */
const _ = function (obj) {
    if (obj instanceof _) return obj; // 传入_实例，直接返回
    /**
     * 当成对象调用时，第一次进入，this为window
     * 这时就new一个对象返回，所以第二次进入的时候
     * this就指向了实例，并将参数保留下来
     */
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
}

_.isFunction = obj => typeof obj === 'function';
// 使用代码来帮你生成相似的函数
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(type => {
    _[`is${type}`] = function (obj) {
        return Object.prototype.toString(obj) === `[object ${type}]`;
    }
})

_.funcNames = obj => Object.keys(obj).filter(name => _.isFunction(obj[name]));

// 这里返回 _(obj).chain() 或者 _.chain(obj) 都可以
_.chainResult = (instance, res) => instance._chain ? _.chain(res) : res;

// obj 内的方法会混入到 _ 的原型上
_.mixin = function (obj) {
    _.funcNames(obj).forEach(funcName => {
        // 因为 _[fn] = obj[fn]，所以可以传入自定义对象，将自定义对象上的方法挂载到 _ 上
        const func = _[funcName] = obj[funcName];
        // 做一层包装，将之前传的参数保留
        _.prototype[funcName] = function (...args) {
            const arg = [this._wrapped];
            args.push(...arg);
            /**
             * 如果要链式调用，那么这里就要做处理
             * 使用重新包装，并且把处理结果传给新对象
             * 如果不使用重新包装，那么每次就要手动更新wrapped，然后返回this
             * 虽然我认为这更方便，因为避免了生成多个对象
             */
            // this._wrapped = func.apply(this, args);
            // return this;
            return _.chainResult(this, func.apply(this, args));
        }
    })
    return _
}

// IM 类似于代理模式
_.chain = function (obj) {
    const instance = _(obj);
    instance._chain = true;
    return instance;
}



/**
 * 挑取对应的key，返回一个新对象
 * 
 * @param {Object} obj 
 * @param {Function|Array|String} iteratee 返回布尔值
 * @param {Array|String} [_keys]
 */
_.pick = function (obj, iteratee, ..._keys) {
    /**
     * 重要的是参数的处理，最后的处理逻辑是一样的，但前期的参数处理是前提
     */

    let keys;

    if (typeof iteratee === 'function') {
        // 是函数，则所有的key都要遍历
        keys = Object.keys(obj);
    } else {
        // 没有传入处理函数，则将需要遍历的key处理后放入keys中
        keys = _keys.unshift(iteratee) && _keys.flat();
        iteratee = keyInObj;
        obj = Object(obj);
    }

    return keys.reduce((res, key) => {
        const val = obj[key];
        if (iteratee(val, key, obj)) res[key] = val;
        return res;
    }, {});

    function keyInObj (val, key, obj) {
        return key in obj;
    }
}

const createIndexFinder = dir => {
    return function (arr, predicate, ctx) {
        const length = arr.length;
        predicate = predicate.bind(ctx || arr);
        let index = dir > 0 ? 0 : length - 1;
        for (; index >= 0 && index < length; index += dir) {
            if (predicate(arr[index], index, arr)) return index;
        }
        return -1;
    }
}

_.findIndex = createIndexFinder(1);
_.findLastIndex = createIndexFinder(-1);

// 寻找有序数组中的下标值
_.sortedIndex = function (arr, val, iteratee, ctx) {
    iteratee = iteratee || (val => val);
    let high = arr.length, low = 0, mid = Math.floor((high + low) / 2);
    while (high > low) {
        if (iteratee(arr[mid]) === val) return mid;
        else if (iteratee(arr[mid]) > val) high = mid;
        else low = mid + 1;
        mid = Math.floor((high + low) / 2);
    }
    return mid;
}

// _.iteratee = builtinIteratee = function(val, ctx) {
//     return 
// }

// 防止命名冲突用，不过模块化后，这个函数就没用了
const original_ = _;
_.onConflict = function () {
    return original_;
}

// 利用闭包保存一个值
_.constant = val => () => val;
// 空函数
_.noop = () => { };

// 获取对象的深层次值
_.deepGet = function (obj, path) {
    if (!Array.isArray(path)) throw Error(`path: ${path} 必须为一个数组`);
    for (let i = 0, len = path.length; i < len; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return obj;
}

// 取对象属性，更像是一个函数式的使用方式
_.shallowProperty = function (key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    }
}

// 先传入要取得值得键名，单值或者数组，再传入对象
_.property = function (path) {
    if (!Array.isArray(path)) return _.shallowProperty(path);
    return function (obj) {
        return _.deepGet(obj, path)
    }
}
// 与property相反，先传入对象，再传入路径
_.propertyOf = function (obj) {
    // 如果obj为null或者undefined
    if (obj == null) return () => { };
    return function (path) {
        return !Array.isArray(path) ? obj[path] : _.deepGet(obj, path);
    }
}

// 取min与max之间的一个数，包括边界
_.random = function (min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

// console.log(_.deepGet({ a: { b: { c: 5 } } }, ['a', 'b', 'c']));

// 转义工具
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
}
// 将对象的键值互换
_.invert = obj => {
    return Object.keys(obj).reduce((_obj, key) => {
        _obj[obj[key]] = key;
        return _obj;
    }, {})
}

// 反向转义
const unescapeMap = _.invert(escapeMap);

// 生成escape函数
function createEscapeFunc (map) {
    return function (str) {
        const regExp = new RegExp(`[${Object.keys(map).join('')}]`, 'g');
        return regExp.test(str) && str.replace(regExp, matched => map[matched]);
    }
}
_.escape = createEscapeFunc(escapeMap);
_.unescape = createEscapeFunc(unescapeMap);

// 这个方法要直接放在原型上，因为如果放在 _ 上，链式调用的时候又会返回一个实例
_.prototype.value = function () {
    return this._wrapped;
}

// 将 _ 上的方法挂载到 _ 实例的原型上
_.mixin(_);

// console.dir(_);


_.mixin({
    addOne: num => num + 1,
});


// console.log(_.chain(4, 5).addOne().addOne().addOne().value());










export default _;