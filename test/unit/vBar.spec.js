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

describe('vBar-test', () => {   
    it('vBar default should be on the left', () => {
        const vm = new Vue({
            template: template,
            data: {
                ops: ops
            }
        }).$mount();
        expect(vm.$refs['vs'].$refs['vScrollbar'].ops.pos).toBe('left');
    });

    it('vBar should be on the right', () => {
        ops = {
            vRail: {
                pos: 'right'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['vScrollbar'].ops.pos).toBe('right');
    });

    it('vBar should be 5px', () => {
        ops = {
            vRail: {
                pos: 'right'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['vScrollbar'].ops.width).toBe('5px');
    });

    it('vBar should be 10px', () => {
        ops = {
            vRail: {
                pos: 'right',
                width: '10px'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].$refs['vScrollbar'].ops.width).toBe('10px');
    });
});