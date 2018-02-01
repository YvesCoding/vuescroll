import Vue from 'vue/dist/vue'
import vuescroll from 'vsUnins'

Vue.use(vuescroll);

let template = 
`
<div style="width:100px;height:100px">
    <vueScroll ref="vs" :ops="ops">
    <div style="width:200px;height:200px">
    </div>
    </vueScroll>
</div>
`

let ops = {};

describe('hBar-test', () => {   
    it('hBar default should be on the bottom', () => {
        const vm = new Vue({
            template: template,
            data: {
                ops: ops
            }
        }).$mount();
        expect(vm.$refs['vs'].$refs['hScrollbar'].ops.pos).toBe('bottom');
    });

    it('hBar should be on the top', () => {
        ops = {
            hRail: {
                pos: 'top'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['hScrollbar'].ops.pos).toBe('top');
    });

    it('hBar should be 5px', () => {
        ops = {
            hRail: {
                pos: 'top'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['hScrollbar'].ops.height).toBe('5px');
    });

    it('hBar should be 10px', () => {
        ops = {
            hRail: {
                pos: 'top',
                height: '10px'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['hScrollbar'].ops.height).toBe('10px');
    });
});