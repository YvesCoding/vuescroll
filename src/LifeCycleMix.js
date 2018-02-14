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
        Object.keys(vm.$options.propsData.ops).forEach(key => {
            defineReactive(
                vm.mergedOptions,
                key,
                vm.$options.propsData.ops
            )
        });
        deepMerge(ops, vm.mergedOptions);
        // to sync the rail and bar
        defineReactive(vm.mergedOptions.vBar, 'pos', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.vBar, 'width', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.hBar, 'pos', vm.mergedOptions.hRail);
        defineReactive(vm.mergedOptions.hBar, 'height', vm.mergedOptions.hRail);
        
        let prefix = "padding-";
        if(vm.mergedOptions.scrollContent.padding) {
            Object.defineProperty(vm.mergedOptions.scrollContent, 'paddPos',   {
                get() {
                    return prefix + vm.mergedOptions.vRail.pos
                }
            })
            Object.defineProperty(vm.mergedOptions.scrollContent, 'paddValue',  {
                get() {
                    return vm.mergedOptions.vRail.width
                }
            })
        } 
        // defineReactive(vm.scrollContent.style, )
    } 
     
}
export default {
    created() {
        hackPropsData.call(this);
    }
}