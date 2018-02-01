import Vue from 'vue/dist/vue'
import vuescroll from 'vsUnins'
import triggerEvent from '../util'
Vue.use(vuescroll);

let template = 
`
<div style="width:100px;height:100px">
    <vueScroll ref="vs">
    <div :style="{width: width, height: height}">
    </div>
    </vueScroll>
</div>
`

let data = {
    width: '200px',
    height: '200px'
};
const vm = new Vue({
    template: template,
    data: data
}).$mount();
document.body.appendChild(vm.$el);

describe('vuescroll-test', () => {
    afterAll(() => {
        vm.$destroy();
    })
    it('[scrollPanel.mouseenter] :bar opacity should be 1', done => {
        let el = vm.$refs['vs'].$el;
        triggerEvent(el, 'mouseenter');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(1);
            done();
        })
    });

    it('[scrollPanel.mouseleave] :bar opacity should be 0', done => {
        let el = vm.$refs['vs'].$el;
        triggerEvent(el, 'mouseleave');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(0);
            done();
        })
    });

    it('[scrollPanel.mousemove] :bar opacity should be 1', done => {
        let el = vm.$refs['vs'].$el;
        triggerEvent(el, 'mousemove');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(1);
            done();
        })
    });

    it('[scrollPanel-scrollTo] :scrollPanel\'s scrollTop and scrollLeft should be 50', () => {
        let el = vm.$refs['vs'].$el;
        vm.$refs['vs'].scrollTo({x:50, y: 50}); 
        expect(vm.$refs['vs'].scrollPanel.el.scrollTop).toBe(50);
        expect(vm.$refs['vs'].scrollPanel.el.scrollLeft).toBe(50);
    });

    it('[vRail.click] :scrollPanel\'s scrollTop should not be 50', done => {
        let el = vm.$refs['vs'].vRail.el;
        triggerEvent(el, 'click'); 
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].scrollPanel.el.scrollTop).not.toBe(50);
            done();
        })
    });

    it('[hRail.click] :scrollPanel\'s scrollLeft should not be 50', done => {
        let el = vm.$refs['vs'].hRail.el;
        triggerEvent(el, 'click'); 
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].scrollPanel.el.scrollLeft).not.toBe(50);
            done();
        })
    });

    it('scrollPanel should not be overflow',  done => {
        data.width = '100px';
        data.height = '100px';
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.height).toBe(0);
            expect(vm.$refs['vs'].hScrollbar.state.width).toBe(0);
            data.width = '200px';
            data.height = '200px';
            vm.$refs['vs'].hideBar();
            done();
        })
    });

    it('[scrollPanel.wheel] :bar opacity should be 1', done => {
        let el = vm.$refs['vs'].scrollPanel.el;
        triggerEvent(el, 'wheel');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(1);
            done();
        })
    });

    it('[scrollPanel.scroll] :bar opacity should be 1', done => {
        let el = vm.$refs['vs'].scrollPanel.el;
        let el$ = vm.$refs['vs'].$el;
        triggerEvent(el, 'wheel');
        triggerEvent(el, 'scroll');
        vm.$nextTick(() => {
            expect(vm.$refs['vs'].vScrollbar.state.opacity).toBe(1);
            triggerEvent(el$, 'mouseleave');
            vm.$nextTick(() => {
                triggerEvent(el, 'scroll');
                done();
            })
        })
    });

    it('[hRail.click] :scrollPanel\'s scrollLeft should not be 0', done => {
        let el = vm.$refs['vs'].hRail.el;
        vm.$refs['vs'].scrollTo({x: 10});
        vm.$nextTick(() => {
            triggerEvent(el, 'click');
            vm.$nextTick(() => {
                expect(vm.$refs['vs'].scrollPanel.el.scrollLeft).toBe(0);
                done();
            })
        })
    });
});