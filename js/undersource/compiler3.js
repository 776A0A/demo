const regExp = {
    interpolate: /<%=([^]+?)%>/g,
    evaluate: /<%([^]+?)%>/g,
    lineTerminator: /[\r\n\t]/g
}

// undersource 的方式
function compiler (htmlText) {

    // 最后的|$是为了匹配最后，使得offset在最后有值
    const matcher = new RegExp(
        [regExp.interpolate.source, regExp.evaluate.source].join('|')
        + '|$', 'g');

    let index = 0;
    let str = `let __p = '`;

    // 这里的replace只是为了拼接str
    htmlText.replace(matcher, (matched, interpolate, evaluate, offset) => {
        str += htmlText.slice(index, offset).replace(regExp.lineTerminator, '');
        index = offset + matched.length;
        if (interpolate) {
            str += `'+${interpolate == null ? '' : interpolate}+'`
        } else if (evaluate) {
            str += `';\n${evaluate}__p+='`
        }
        return matched;
    })

    // 最后去掉大于一个的空格
    str = `${str}';return __p`.replace(/ {2,}/g, '');

    let fn;
    try {
        fn = Function('data', str)
    } catch (error) {
        console.error({ errMsg: error.message });
    }

    return fn;
}

export default compiler;