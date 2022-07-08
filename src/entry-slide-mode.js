import _install from 'src/core';
import { core, render, extraConfigs, extraValidators } from './mode/slide';

const Vuescroll = {
  ..._install(core, render, extraConfigs, extraValidators)
};

export default Vuescroll;
