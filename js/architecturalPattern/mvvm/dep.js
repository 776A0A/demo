/**
 * 依赖收集
 *
 * @export
 * @class Dep
 */
export default class Dep {
  constructor () {
    this.subs = new Set()
  }
  addSub (sub) {
    this.subs.add(sub);
  }
  notify () {
    this.subs.forEach(sub => sub.update());
  }
}