const regExp = {
    interpolate: /<%=([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g
}

function compiler (selector) {
    let str = document.getElementById(selector).innerHTML;
    /**
     * 将代码替换为下面这样
     * ';for (var i = 0; i < data.length; i++) { __p+='
     * <li>
     *  <a href='+data[i].url+'">'
     *  +data[i].name+'
     *  </a>
     * </li>
     * ';}__p+='
    */
    str = str
        .replace(/[\r\n\t]/g, '')
        .replace(regExp.interpolate, (matched, interpolate) => `'\n+${interpolate == null ? '' : interpolate}+'`)
        .replace(regExp.evaluate, (matched, evaluate) => `';\n${evaluate}\n__p+='`);
    /**
     * 首位再拼接一下
     */
    str = `let __p = '${str}';return __p;`.replace(/ {2,}/g, '');

    const fn = Function('data', str);

    return fn;
}

export default compiler