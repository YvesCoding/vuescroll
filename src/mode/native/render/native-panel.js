import { createContent } from './native-content';
import { getGutter } from 'shared/util';

export function processPanelData(vm) {
  // scrollPanel data start
  const scrollPanelData = {
    ref: 'scrollPanel',
    style: {},
    class: [],
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel
    }
  };

  scrollPanelData.class.push('__native');
  // dynamic set overflow scroll
  // feat: #11
  if (vm.mergedOptions.scrollPanel.scrollingY) {
    scrollPanelData.style['overflowY'] = vm.bar.vBar.state.size ? 'scroll' : '';
  } else {
    scrollPanelData.style['overflowY'] = 'hidden';
  }

  if (vm.mergedOptions.scrollPanel.scrollingX) {
    scrollPanelData.style['overflowX'] = vm.bar.hBar.state.size ? 'scroll' : '';
  } else {
    scrollPanelData.style['overflowX'] = 'hidden';
  }

  let gutter = getGutter();
  /* istanbul ignore if */
  if (!gutter) {
    scrollPanelData.class.push('__hidebar');
  } else {
    //__gutter
    scrollPanelData.class.push('__gutter');
    if (vm.bar.hBar.state.size && vm.mergedOptions.scrollPanel.scrollingX) {
      scrollPanelData.style.height = `calc(100% + ${gutter}px)`;
    }
  }

  // clear legency styles of slide mode...
  scrollPanelData.style.transformOrigin = '';
  scrollPanelData.style.transform = '';

  return scrollPanelData;
}

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createPanel(h, vm) {
  let scrollPanelData = {};

  scrollPanelData = processPanelData(vm);

  return (
    <scrollPanel {...scrollPanelData}>{createPanelChildren(h, vm)}</scrollPanel>
  );
}

export function createPanelChildren(h, vm) {
  return createContent(h, vm);
}
