import { scrollTo } from 'src/mode/native/mixins/api';
import _install from 'src/core';

import { core, render, extraConfigs } from './mode/native';

const Vuescroll = {
  scrollTo,
  ..._install(core, render, extraConfigs)
};

export default Vuescroll;
