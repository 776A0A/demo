const shuffle = arr => {
  let index = 0, ranNum, _arr = [...arr];
  const len = arr.length, res = [];

  while (index < len) {
    ranNum = Math.floor(Math.random() * _arr.length);

    res[index++] = _arr.splice(ranNum, 1)[0];
  }

  return res;
};

export default shuffle;