import GCF, {validateOptions} from "../config/global-config"; 
import {
  deepMerge,
  defineReactive
} from "../util";

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
  const vm = this;
  if(vm.$options.name === "vueScroll") {
    const _gfc = deepMerge(vm.$vuescrollConfig, {});
    const ops = deepMerge(GCF, _gfc);
    vm.$options.propsData.ops = vm.$options.propsData.ops || {};
    Object.keys(vm.$options.propsData.ops).forEach(key => {
      {
        defineReactive(
          vm.mergedOptions,
          key,
          vm.$options.propsData.ops
        );
      }
    });
    // from ops to mergedOptions
    deepMerge(ops, vm.mergedOptions);
    // to sync the rail and bar
    defineReactive(vm.mergedOptions.vBar, "pos", vm.mergedOptions.vRail);
    defineReactive(vm.mergedOptions.vBar, "width", vm.mergedOptions.vRail);
    defineReactive(vm.mergedOptions.hBar, "pos", vm.mergedOptions.hRail);
    defineReactive(vm.mergedOptions.hBar, "height", vm.mergedOptions.hRail);
        
    const prefix = "padding-";
    defineReactive(vm.mergedOptions.scrollContent, "paddPos",   
      () => {
        return prefix + vm.mergedOptions.vRail.pos;
      }
    );
    defineReactive(vm.mergedOptions.scrollContent, "paddValue",  
      () => {
        return vm.mergedOptions.vRail.width;
      }
    );
  } 
    
}
export default {
  data() {
    return {
      shouldStopRender: false
    };
  },
  created() {
    hackPropsData.call(this);
    this.shouldStopRender = validateOptions(this.mergedOptions);
  }
};