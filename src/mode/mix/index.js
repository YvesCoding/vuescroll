import scrollPanel from 'mode/shared/panel';
import bar from 'mode/shared/bar';

import render from './render';
import mixins from './mixins';
import { configs, validators } from './config';

import { _install } from 'mode/shared/util';

const component = _install(
  [scrollPanel, bar],
  render,
  configs,
  mixins,
  validators
);

export default function install(Vue, opts = {}) {
  Vue.component(opts.name || component.name, component);
  Vue.prototype.$vuescrollConfig = opts.ops;
}

export { component };
