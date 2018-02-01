import Vue from 'vue/dist/vue'
import vuescroll from 'vsUnins'
import triggerEvent from '../util'
Vue.use(vuescroll);

let template = 
`
<div style="width:100px;height:100px">
    <vueScroll ref="vs">
    <div style="width:200px;height:200px">
    </div>
    </vueScroll>
</div>
`

let ops = {};
const vm = new Vue({
    template: template
}).$mount();
document.body.appendChild(vm.$el);

describe('vuescroll-test', () => {
    it('bar opacity should be 1', done => {
        let el = vm.$refs['vs'].$el;
        triggerEvent(el, 'mouseenter');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(1);
            done();
        })
    });
});