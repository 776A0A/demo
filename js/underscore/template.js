/**
 * 模板引擎，利用Function或者eval可实现
 * 只要是代码部分就放在 <% ... %> 中
 * 表达式都放在 <%= ... %> 中
 * 另外script的type是text/html
 */

const r = {
    interpolate: /<%=(.+?)%>/,
    evaluate: /<%(.+?)%>/,
    lineTerminator: /[\r\n\t]/g
}

function template (str) {
    if (typeof str !== 'string') throw TypeError(`参数 str: ${str} 必须为字符串!`);

    /**
    * 基本效果，将代码替换为下面这样
    * ';for (var i = 0; i < data.length; i++) { __p+='
    * <li>
    *  <a href='+data[i].url+'">'
    *  +data[i].name+'
    *  </a>
    * </li>
    * ';}__p+='
    */

    const matcher = new RegExp(`${r.interpolate.source}|${r.evaluate.source}`, 'g');

    str = str
        .replace(r.lineTerminator, '')
        .replace(matcher, (matched, interpolate, evaluate) => {
            if (interpolate) {
                return `'\n+${interpolate}+\n'`
            } else if (evaluate) {
                return `';\n${evaluate};\n__p+='`
            }
        });

    // 接头接尾，去掉连续两个以上的空格
    str = `let __p = '';\n__p+='${str}';return __p;`.replace(/ {2,}/g, '');

    return Function('data', str);
}



export default template;
















function _compile (selector) {
    let text = document.querySelector(selector).innerHTML;

    let code = `let __p = '';\n__p+='`;

    let index = 0;

    text.replace(new RegExp(`${r.interpolate.source}|${r.evaluate.source}|$`, 'g'), (matched, interpolate, evaluate, offset) => {
        code += text.slice(index, offset);
        index = offset + matched.length;
        if (interpolate) {
            code += `'+${interpolate}+'`
        } else if (evaluate) {
            code += `';${evaluate}__p+='`
        }
    })

    code = `${code}';return __p;`.replace(r.lineTerminator, '');

    return Function('data', code);
}