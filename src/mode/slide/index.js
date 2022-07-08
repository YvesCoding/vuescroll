import { createPanel } from './slide-panel';
import core from './core';
import { configs, configValidator } from './config';

export {
  core,
  createPanel as render,
  configs as extraConfigs,
  configValidator as extraValidators
};
