/**
 * 依赖收集
 *
 * @export
 * @class Dep
 */
export default class Dep {
  constructor () {
    this.subs = [];
  }
  addSub (sub) {
    this.subs.push(sub);
  }
  notify () {
    this.subs.forEach(sub => sub.update());
  }
}