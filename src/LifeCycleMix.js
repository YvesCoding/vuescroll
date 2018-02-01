import GCF from './GlobalConfig' 
import {
     deepMerge,
     defineReactive
} from './util'

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
    let vm = this;
    if(vm.$options.name === 'vueScroll') {
        let ops = deepMerge(GCF, {});
        vm.$options.propsData.ops = vm.$options.propsData.ops || {};
        Object.keys(vm.$options.propsData.ops).forEach(function(key) {
            defineReactive(
                vm.fOps,
                key,
                vm.$options.propsData.ops
            )
        });
        deepMerge(ops, vm.fOps);
        // to sync the rail and bar
        defineReactive(vm.fOps.vBar, 'pos', vm.fOps.vRail);
        defineReactive(vm.fOps.vBar, 'width', vm.fOps.vRail);
        defineReactive(vm.fOps.hBar, 'pos', vm.fOps.hRail);
        defineReactive(vm.fOps.hBar, 'height', vm.fOps.hRail);
        
        let prefix = "padding-";
        if(vm.fOps.scrollContent.padding) {
            Object.defineProperty(vm.fOps.scrollContent, 'paddPos',   {
                get() {
                    return prefix + vm.fOps.vRail.pos
                }
            })
            Object.defineProperty(vm.fOps.scrollContent, 'paddValue',  {
                get() {
                    return vm.fOps.vRail.width
                }
            })
        } 
        // defineReactive(vm.scrollContent.style, )
    } 
     
}
export default {
    created: function() {
        hackPropsData.call(this);
    }
}