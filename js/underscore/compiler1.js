// John Resig 08年中的方式
function _compiler (selector) {
    let str = document.getElementById(selector).innerHTML;

    str = str
        .replace(/[\r\n\t]/g, '') // 去掉回车符、换行符、制表符
        // 下面一行如果和后面两行换了位置会造成错误
        .replace(/<%=(.*?)%>/g, `');p.push($1);p.push('`)
        .replace(/<%/g, `');`)
        .replace(/%>/g, `p.push('`);

    str = `p.push('${str}');`;

    const fn = Function('data', `
        const p = [];
        ${str}
        return p.join('');
    `)

    return fn;
}


export default (function () {
    let fn;
    return function (selector) {
        return fn || (fn = _compiler(selector))
    }
})();