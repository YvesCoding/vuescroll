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

describe('hRail-test', () => {   
    it('hRail default should be on the bottom', () => {
        const vm = new Vue({
            template: template,
            data: {
                ops: ops
            }
        }).$mount();
        expect(vm.$refs['vs'].fOps.hRail.pos).toBe('bottom');
    });

    it('hRail should be on the top', () => {
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
        expect(vm.$refs['vs'].fOps.hRail.pos).toBe('top');
    });

    it('hRail\'s height should be 5px', () => {
        ops = {
            hRail: {
                pos: 'bottom'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].fOps.hRail.height).toBe('5px');
    });

    it('hRail\'s height should be 10px', () => {
        ops = {
            hRail: {
                pos: 'bottom',
                height: '10px'
            }
        }
        const vm = new Vue({
            data: {
                ops: ops
            },
            template: template
        }).$mount();
        expect(vm.$refs['vs'].fOps.hRail.height).toBe('10px');
    });

     
});