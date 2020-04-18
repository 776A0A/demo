function compiler (selector, data) {
    const elStr = document.getElementById(selector).innerHTML;
    let str = `const p = []; p.push('${elStr
        .replace(/[\r\n\t]/g, '')
        .replace(/<%=(.*?)%>/g, `');p.push($1);p.push('`)
        .replace(/<%/g, `');`)
        .replace(/%>/g, `p.push('`)
        }');return p.join('')`;


    const fn = new Function('obj', str);

    return fn(data)
}


export default compiler