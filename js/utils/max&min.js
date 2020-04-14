const max = arr => {
  return arr.reduce((prev, curr) => Math.max(prev, curr))
}

console.log(max([1, 2, 4, 99, 0, -1]));

export default max