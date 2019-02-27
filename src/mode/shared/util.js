import createComponent from 'core/index';
import { extendOpts } from 'shared/global-config';
import scrollPanel from 'mode/shared/panel';
import bar from 'mode/shared/bar';

/**
 * Init following things
 * 1. Component
 * 2. Render
 * 3. Config
 */
export function _install(
  core,
  render,
  extraConfigs = [],
  extraValidators = []
) {
  const components = {
    [scrollPanel.name]: scrollPanel,
    [bar.name]: bar
  };

  const opts = {};
  opts.components = components;
  opts.render = render;
  opts.mixins = core;

  const comp = createComponent(opts);

  // Init Config
  extendOpts(extraConfigs, extraValidators);

  return comp;
}

/**
 * Get the children of parent those are in viewport
 */
export function getCurrentViewportDom(parent, container) {
  const children = parent.children;
  const domFragment = [];

  const isCurrentview = (dom) => {
    const { left, top, width, height } = dom.getBoundingClientRect();
    const {
      left: parentLeft,
      top: parentTop,
      height: parentHeight,
      width: parentWidth
    } = container.getBoundingClientRect();
    if (
      left - parentLeft + width > 0 &&
      left - parentLeft < parentWidth &&
      top - parentTop + height > 0 &&
      top - parentTop < parentHeight
    ) {
      return true;
    }
    return false;
  };

  for (let i = 0; i < children.length; i++) {
    const dom = children.item(i);
    if (isCurrentview(dom) && !dom.isResizeElm) {
      domFragment.push(dom);
    }
  }
  return domFragment;
}
