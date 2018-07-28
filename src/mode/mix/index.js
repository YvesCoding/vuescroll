import scrollPanel from 'mode/shared/panel';
import bar from 'mode/shared/bar';
import scrollContent from 'mode/native/render/native-content';

import render from './render';
import mixins from './mixins';

import { _init } from 'mode/shared/util';

export default function install(Vue, opts = {}) {
  opts._components = [scrollPanel, scrollContent, bar];
  opts.mixins = mixins;
  opts.render = render;
  opts.Vue = Vue;

  _init(opts);
}
