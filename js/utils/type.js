const s = Object.prototype.toString;

const type = d => {
  return s.call(d).split(' ')[1].slice(0, -1).toLowerCase();
}

export default type