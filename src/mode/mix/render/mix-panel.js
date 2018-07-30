// begin importing
import { createPanel as createNativePanel } from 'mode/native/render/native-panel';
import { createPanel as createSlidePanel } from 'mode/slide/render/slide-panel';
/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createPanel(h, vm) {
  if (vm.mode == 'native') {
    return createNativePanel(h, vm);
  } else if (vm.mode == 'slide') {
    return createSlidePanel(h, vm);
  }
}
