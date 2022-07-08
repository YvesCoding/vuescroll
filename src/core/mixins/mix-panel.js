// begin importing
import { createPanel as createNativePanel } from 'mode/native/native-panel';
import { createPanel as createSlidePanel } from 'mode/slide/slide-panel';
/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export default function createPanel(vm) {
  if (vm.mode == 'native') {
    return createNativePanel(vm);
  } else if (vm.mode == 'slide') {
    return createSlidePanel(vm);
  }
}
