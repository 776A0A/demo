const flatten = (arr, depth = Infinity) => {
  let _arr = arr.concat();

  if (depth === Infinity) {
    while (_arr.some(Array.isArray)) {
      _arr = [].concat(..._arr);
    }
  } else if (depth) {
    for (let i = depth - 1; i >= 0; i--) {
      _arr = [].concat(..._arr)
    }
  }

  return _arr;
}

const a = [1, 2, [3, 4, [5, 6, [7, 8]]]]

console.log(flatten(a, 1));

export default flatten
