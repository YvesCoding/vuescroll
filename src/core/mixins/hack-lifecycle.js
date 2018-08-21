import GCF, { validateOps } from 'shared/global-config';
import { mergeObject, defineReactive } from 'shared/util';

/**
 * hack the lifeCycle
 * to merge the global data into user-define data
 */
function hackPropsData() {
  const vm = this;
  const _gfc = mergeObject(vm.$vuescrollConfig || {}, {});
  const ops = mergeObject(GCF, _gfc);

  vm.$options.propsData.ops = vm.$options.propsData.ops || {};
  Object.keys(vm.$options.propsData.ops).forEach(key => {
    {
      defineReactive(vm.mergedOptions, key, vm.$options.propsData.ops);
    }
  });
  // from ops to mergedOptions
  mergeObject(ops, vm.mergedOptions);
}
export default {
  data() {
    return {
      shouldStopRender: false,
      mergedOptions: {
        vuescroll: {},
        scrollPanel: {},
        scrollContent: {},
        rail: {},
        bar: {}
      }
    };
  },
  created() {
    hackPropsData.call(this);
    this._isVuescrollRoot = true;
    this.renderError = validateOps(this.mergedOptions);
  }
};
