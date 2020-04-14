const str = `
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy

[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
`;

// let arr = str.split(/\r?\n/);

// arr = arr.filter(line => {
//   const r = /^\s*;+/;
//   if (r.test(line) || !line) return false;
//   return true;
// })

// console.log(`剔除掉空行以及;开头：\n`, arr);

// const res = {}

// arr = arr.join(' ');

// console.log(`重新凭借并以空格分隔的字符串：\n`, arr);

// arr = arr.split(/\[.*?\]/);

// console.log(`\n`, arr);

/**
 * 第一次尝试
 */

// const newObjIndex = []

// for (let i = 0, line; line = arr[i]; i++) {
//   const r = /^\[.*\]$/;
//   if (r.test(line)) {
//     newObjIndex.push(i)
//   }
// }

// const _arr = [];

// newObjIndex.forEach((item, i) => {
//   if (i === 0) {
//     _arr.push(arr.slice(0, item));
//     _arr.push(arr.slice(item, newObjIndex[i + 1] || arr.length))
//   }
//   else {
//     _arr.push(arr.slice(item, newObjIndex[i + 1] || arr.length))
//   }
// })

// // console.log(_arr);

// const res = {}

// _arr.forEach(_obj => {
//   const r = /^\[.*\]$/;
//   if (r.test(_obj[0])) {
//     const key = _obj.shift().replace(/^\[(.*)\]$/, '$1');
//     res[key] = {}
//     _obj.forEach(item => {
//       const [_key, _val] = item.split('=');
//       res[key][_key] = _val;
//     })
//   } else {
//     _obj.forEach(item => {
//       const [_key, _val] = item.split('=');
//       res[_key] = _val;
//     })
//   }
// })

// console.log(res);

let text = "'I'm the cook,' he said, 'it's my job.'";
console.log(text.replace(/'(\w)+'\s/g, '"'));