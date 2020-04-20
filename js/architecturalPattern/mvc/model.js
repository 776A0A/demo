/**
 * 数据层
 * 负责储存数据，同时操作数据
 * 另外，也要储存视图层，因为当数据发生变化，需要通知视图层更新，同时将自身传出
 *
 * @class Model
 */
class Model {
    constructor () {
        this.val = 0;
        this.views = [];
    }
    add () {
        this.val++;
    }
    minus () {
        this.val--;
    }
    getVal() {
        return this.val;
    }
    register (view) {
        this.views.push(view)
    }
    notify () {
        this.views.forEach(view => view.render(this))
    }
}

export default Model;