import { refreshAll } from 'core/mixins/api';
import install from 'mode/native/index';
import '../style/vuescroll.scss';

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
