import Vue from 'vue';
import vuescroll from './components/vuescroll';
import GCF from './shared/global-config';
import { deepMerge, log } from './util';

let scroll = {
  install(Vue) {
    if (scroll.isInstalled) {
      log.warn('You should not install the vuescroll again!');
      return;
    }
    // registry vuescroll
    Vue.component(vuescroll.name, vuescroll);

    Vue.prototype.$vuescrollConfig = deepMerge(GCF, {});
    scroll.isInstalled = true;
    scroll.version = '__version__';
  }
};
/* istanbul ignore if */
if (typeof Vue !== 'undefined' && process.env.NODE_FORMAT === 'umd') {
  Vue.use(scroll);
}
export default scroll;
