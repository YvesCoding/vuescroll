// begin importing
import {
  createPanelChildren as createNativePanel,
  processPanelData as processNativePanelData
} from 'mode/native/render/native-panel';
import {
  createPanelChildren as createSlidePanel,
  processPanelData as processSlidePanelData
} from 'mode/slide/render/slide-panel';
/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createPanel(h, vm) {
  let scrollPanelData = {};

  if (vm.mode == 'native') {
    scrollPanelData = processNativePanelData(vm);
  } else if (vm.mode == 'slide') {
    scrollPanelData = processSlidePanelData(vm);
  }

  return (
    <scrollPanel {...scrollPanelData}>{createPanelChildren(vm, h)}</scrollPanel>
  );
}

function createPanelChildren(vm, h) {
  if (vm.mode == 'native') {
    return createNativePanel(h, vm);
  } else if (vm.mode == 'slide') {
    return createSlidePanel(h, vm);
  }
}
