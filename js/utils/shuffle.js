// 更快
const shuffle = arr => {
  const _arr = arr.concat();

  let randomNum;

  for (let i = 0, len = arr.length; i < len; i++) {
    randomNum = Math.floor(Math.random() * len);
    [_arr[i], _arr[randomNum]] = [_arr[randomNum], _arr[i]]
  }

  return _arr;
}

const _shuffle = arr => {
  let index = 0, ranNum, _arr = [...arr];
  const len = arr.length, res = [];

  while (index < len) {
    ranNum = Math.floor(Math.random() * _arr.length);
 
    res[index++] = _arr.splice(ranNum, 1)[0];
  }

  return res;
};
                                
console.time()
for (let i = 0; i < 100; i++) {
  shuffle(Array.from({ length: 10000 }))
}
console.timeEnd()

console.time()
for (let i = 0; i < 100; i++) {
  _shuffle(Array.from({ length: 10000 }))
}
console.timeEnd()




// export default shuffle;