import { refreshAll } from 'core/mixins/api';
import install from './slide/index';

const Vuescroll = {
  install,
  version: '__version__',
  refreshAll
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuescroll);
}

export default Vuescroll;
