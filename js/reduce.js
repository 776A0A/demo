const reduce = (arr, fn, val) => {

  let acc = val === undefined ? arr[0] : val; // 累计值

  for (
    // 如果没有提供初始值，那么 acc 就为第一项，那么 i 就应该为第二项
    let i = val === undefined ? 1 : 0,
    item;
    (item = arr[i++]);
  ) {
    acc = fn(acc, item);
  }

  return acc;
};


console.log(reduce([1, 2, 3], (acc, item) => {
  return acc + item;
}));


export default reduce;