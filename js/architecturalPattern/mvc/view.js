const _ = id => document.getElementById(id);


/**
 * 视图层
 * 负责绑定一些事件，这些事件处理器存在controller中
 * 通知负责渲染页面，渲染页面需要拿到model才能拿到数据
 *
 * @class View
 */
class View {
    constructor (controller) {
        this.controller = controller;
        this.num = _('num'), this.addBtn = _('add'), this.minusBtn = _('minus');


        // 初始化一些绑定事件
        this.addBtn.addEventListener('click', e => {
            controller.increment()
        })
        this.minusBtn.addEventListener('click', e => {
            controller.decrement()
        })

    }
    render(model) {
        // 渲染数据，自然是要拿到数据，而数据是model管理的，所以要将model传入
        this.num.textContent = model.getVal();
    }
}

export default View;