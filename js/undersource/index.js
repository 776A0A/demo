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

// 这个方法要直接放在原型上，因为如果放在 _ 上，链式调用的时候又会返回一个实例
_.prototype.value = function () {
    return this._wrapped;
}

// 将 _ 上的方法挂载到 _ 实例的原型上
_.mixin(_);

console.dir(_);


_.mixin({
    addOne: num => num + 1,
});


console.log(_.chain(4, 5).addOne().addOne().addOne().value());










export default _;