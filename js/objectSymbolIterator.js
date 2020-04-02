// 为对象添加迭代器

function* iterator () {
  for (const key in this) {
    if (this.hasOwnProperty(key)) {
      yield this[key];
    }
  }
}

Object.prototype[Symbol.iterator] = iterator;

const a = {
  b: 1,
  c: 2
};

for (const val of a) {
  console.log(val);
}