import render from './native-panel';
import core from './core';

import { _install } from 'mode/shared/util';

const component = _install(render, [], core, []);

export default function install(Vue, opts = {}) {
  Vue.component(opts.name || component.name, component);
  Vue.prototype.$vuescrollConfig = opts.ops || {};
}

export { component };
