import { createPanel } from './native-panel';
import core from './core';
import { config } from './config';

import { _install } from 'mode/shared/util';

const component = _install(core, createPanel, [config]);

export default function install(Vue, opts = {}) {
  Vue.component(opts.name || component.name, component);
  Vue.prototype.$vuescrollConfig = opts.ops || {};
}

export { component };
