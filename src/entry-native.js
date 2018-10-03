import { refreshAll } from 'core/mixins/api';
import { scrollTo } from 'src/mode/native/mixins/api';

import install from 'mode/native/index';

const Vuescroll = {
  install,
  version: '__version__',
  refreshAll,
  scrollTo
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuescroll);
}

export default Vuescroll;
