/**
 * 返回对象下的方法名数组
 * @param {Object} obj 
 * @returns Array
 */
const funcNames = function (obj) {
    return Object.keys(obj).filter(name => typeof obj[name] === 'function')
}

/**
 * 字符串反转
 * @param {String} str 
 * @returns String
 */
const reverse = function (str) {
    return String(str).split('').reverse().join('');
}

/**
 * 挑取对应的key，返回一个新对象
 *
 * @param {Object} obj
 * @param {Function|Array|String} iteratee 返回布尔值
 * @param {Array|String} [keys]
 */
const pick = function (obj, iteratee, ...keys) {
    if (!iteratee && !keys) return obj;

    let _keys;

    if (typeof iteratee === 'function') {
        _keys = Object.keys(obj);
    } else {
        _keys = flatten([iteratee].concat(keys ? keys : []))
        iteratee = keyInObj;
    }

    return _keys.reduce((_obj, key) => {
        if (iteratee(obj[key], key, obj)) _obj[key] = obj[key];
        return _obj;
    }, {});

    function keyInObj (val, key, obj) {
        return key in obj;
    }
}

/**
 * 
 * @param {Array} input 输入
 * @param {Boolean} shallow 是否只扁平一层
 * @param {Array} output 输出
 */
const flatten = function (input, shallow, output = []) {
    let index = output.length;
    for (let i = 0, len = input.length; i < len; i++) {
        const value = input[i];
        if (Array.isArray(value)) {
            if (shallow) {
                let j = 0, len = value.length;
                while (j < len) output[index++] = value[j++];
            } else {
                flatten(value, shallow, output)
                index = output.length;
            }
        } else {
            output[index++] = value;
        }
    }
    return output;
}

function createIndexFinder (dir) {
    return function (arr, val) {
        const len = arr.length;
        let i = dir > 0 ? 0 : len - 1;
        for (; i >= 0 && i < len; i += dir) {
            const item = arr[i];
            if (item === val) return i;
        }
        return -1;
    }
}

const findIndex = createIndexFinder(1);
const findLastIndex = createIndexFinder(-1);

const sortedIndex = function (arr, val, iteratee = val => val, ctx) {
    let h = arr.length, l = 0, mid = Math.floor((h + l) / 2);

}

// 利用闭包保存一个值
const constant = val => () => val;

const noop = function () { };

/**
 * 获取对象的深层次值
 * @param {Array} obj 
 * @param {Array|String} path 传入数组或者表达式 `a.b.c`
 */
const deepGet = function (obj, path) {
    path = Array.isArray(path) ? path : path.split('.').map(key => key.trim());
    for (let i = 0, len = path.length; i < len; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return obj;
}

/**
 * 数组乱序
 * @param {Array} arr 
 */
const shuffle = function (arr) {
    const _arr = arr.concat();
    let randomNum;
    for (let i = 0, len = _arr.length; i < len; i++) {
        randomNum = random(len - 1);
        [_arr[randomNum], _arr[i]] = [_arr[i], _arr[randomNum]];
    }
    return _arr;
}

/**
 * min~max之间的随机数，包括边界
 * @param {Number} min 
 * @param {Number} [max] 
 */
const random = function (min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

// 获取对象的某个属性值
const property = function (path) {
    return function (obj) {
        return deepGet(obj, path);
    }
}
const propertyOf = function (obj) {
    return function (path) {
        return deepGet(obj, path)
    }
}

/**
 * 对象键值互换
 * @param {Object} obj 
 */
const invert = function (obj) {
    return Object.keys(obj).reduce((_obj, key) => {
        _obj[obj[key]] = key;
        return _obj;
    }, {})
}

const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
const unescapeMap = invert(escapeMap);
function createEscapeFunction (map) {
    return function (str) {
        const r = new RegExp(`${Object.keys(map).join('|')}`, 'g');
        return str.replace(r, matched => map[matched]);
    }
}
// 转义和反向转义
const escape = createEscapeFunction(escapeMap);
const unescape = createEscapeFunction(unescapeMap);


export {
    funcNames, reverse, pick, flatten, findIndex, findLastIndex, sortedIndex,
    constant, noop, deepGet, shuffle, random, invert, property, propertyOf, escape, unescape
}