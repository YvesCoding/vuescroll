import scrollPanel from 'mode/shared/panel';
import bar from 'mode/shared/bar';

import render from './render';
import mixins from './mixins';

import { _init } from 'mode/shared/util';

export default function install(Vue, opts = {}) {
  opts._components = [scrollPanel, bar];
  opts.mixins = mixins;
  opts.render = render;
  opts.Vue = Vue;

  _init(opts);
}
