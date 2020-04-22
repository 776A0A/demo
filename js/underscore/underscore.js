import { funcNames } from './utils.js';
/**
 * _ 是一个函数，同时挂载有许多方法
 * 可以直接使用_.xx调用方法
 * 也可以_('xx')调用函数，返回一个对象，该对象的原型上挂在了 _ 上的方法
 */
const _ = function (data) {
    if (data instanceof _) return data;
    /**
    * 当成函数调用时，第一次进入，this为window
    * 这时就new一个对象返回，所以第二次进入的时候
    * this就指向了实例，并将参数保留下来
    */
    if (!(this instanceof _)) return new _(data);
    this.wrapped = data;;
}

// 生成类型判断函数
const types = ['Arguments', 'Function', 'String', 'Number', 'Object', 'Date', 'RegExp', 'Error'];
types.forEach(type => {
    _[`is${type}`] = function (arg) {
        return Object.prototype.toString.call(arg) === `[object ${type}]`;
    }
})

// 如果要链式调用，就使用chain，包装一层，添加_chain属性，然后返回
_.chain = function (data) {
    const instance = _(data);
    instance._chain = true;
    return instance;
}
/**
 * 处理函数返回结果
 * 这里返回 _(obj).chain() 或者 _.chain(obj) 都可以
 * @param {_} instance _ 实例
 * @param {*} res 函数调用的结果
 */
_.chainResult = function (instance, res) {
    return instance._chain ? _(res).chain() : res;
}

// obj 内的方法会混入到 _ 的原型上
_.mixin = function (obj) {
    funcNames(obj).forEach(funcName => {
        /**
         * 有了这一句，用户可以自定义方法在 _ 下了
         * 因为 _[fn] = obj[fn]，所以可以传入自定义对象，将自定义对象上的方法挂载到 _ 上
         */
        const func = _[funcName] = obj[funcName];

        // 做一层包装，将之前传的参数拼接上
        _.prototype[funcName] = function (...args) {
            const arg = [this.wrapped];
            args = arg.concat(args);
            /**
             * 如果要链式调用，那么这里就要做处理
             * 使用重新包装，并且把处理结果传给新对象
             * 如果不使用重新包装，那么每次就要手动更新wrapped，然后返回this
             * 虽然我认为这更方便，因为避免了生成多个对象
             */
            // this._wrapped = func.apply(this, args);
            // return this;
            return _.chainResult(this, func.call(this, ...args));
        }
    })
}


// 这个方法要直接放在原型上，因为如果放在 _ 上，链式调用的时候又会返回一个实例
_.prototype.value = function () {
    return this.wrapped;
}

export default _;