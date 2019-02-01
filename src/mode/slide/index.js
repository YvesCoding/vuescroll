import { createPanel } from './slide-panel';
import core from './core';
import { config, configValidator } from './config';

import { _install } from 'mode/shared/util';

const component = _install(core, createPanel, [config], [configValidator]);

export default function install(Vue, opts = {}) {
  Vue.component(opts.name || component.name, component);
  Vue.prototype.$vuescrollConfig = opts.ops || {};
}

export { component };
