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

describe('vRail-test', () => {   
    it('vRail default should be on the left', () => {
        const vm = new Vue({
            template: template,
            data: {
                ops: ops
            }
        }).$mount();
        expect(vm.$refs['vs'].fOps.vRail.pos).toBe('left');
    });

    it('vRail should be on the right', () => {
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
        expect(vm.$refs['vs'].fOps.vRail.pos).toBe('right');
    });

    it('vRail\'s width should be 5px', () => {
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
        expect(vm.$refs['vs'].fOps.vRail.width).toBe('5px');
    });

    it('vRail\'s width should be 10px', () => {
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
        expect(vm.$refs['vs'].fOps.vRail.width).toBe('10px');
    });

     
});