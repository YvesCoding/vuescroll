import { modes } from 'shared/constants';
import { error } from 'shared/util';
import {
  config as slideConfig,
  configValidator as slideValidator
} from 'mode/slide/config';

import { config as nativeConfig } from 'mode/native/config';

const config = {
  // vuescroll
  vuescroll: {
    mode: 'native'
  }
};
/**
 * validate the options
 * @export
 * @param {any} ops
 */
function configValidator(ops) {
  let renderError = false;
  const { vuescroll } = ops;

  // validate modes
  if (!~modes.indexOf(vuescroll.mode)) {
    error(
      `Unknown mode: ${
        vuescroll.mode
      },the vuescroll's option "mode" should be one of the ${modes}`
    );
    renderError = true;
  }

  return renderError;
}

export const configs = [config, slideConfig, nativeConfig];
export const configValidators = [configValidator, slideValidator];
