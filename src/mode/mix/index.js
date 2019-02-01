import render from './mix-panel';
import core from './core';
import { configs, configValidators } from './config';

import { _install } from 'mode/shared/util';

const component = _install(core, render, configs, configValidators);

export default function install(Vue, opts = {}) {
  Vue.component(opts.name || component.name, component);
  Vue.prototype.$vuescrollConfig = opts.ops || {};
}

export { component };
