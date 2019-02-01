import {
  createEasingFunction,
  easingPattern
} from 'core/third-party/easingPattern/index';
import { core } from 'core/third-party/scroller/animate';
import createComponent from 'core/index';
import { extendOpts } from 'shared/global-config';
import scrollPanel from 'mode/shared/panel';
import bar from 'mode/shared/bar';

/**
 * Start to scroll to a position
 */
export function goScrolling(
  x,
  y,
  startLocationX,
  startLocationY,
  maxX,
  maxY,
  speed,
  easing,
  scrollingComplete,
  render
) {
  // deltaX,
  // deltaY,
  let deltaX = x - startLocationX;
  let deltaY = y - startLocationY;
  let positionX = startLocationX;
  let positionY = startLocationY;
  /**
   * keep the limit of scroll delta.
   */
  /* istanbul ignore next */
  if (startLocationY + deltaY < 0) {
    deltaY = -startLocationY;
  }
  if (startLocationY + deltaY > maxY) {
    deltaY = maxY - startLocationY;
  }
  if (startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if (startLocationX + deltaX > maxX) {
    deltaX = maxX - startLocationX;
  }

  const easingMethod = createEasingFunction(easing, easingPattern);

  const stepCallback = percentage => {
    positionX = startLocationX + deltaX * percentage;
    positionY = startLocationY + deltaY * percentage;
    render(Math.floor(positionX), Math.floor(positionY));
  };

  const verifyCallback = () => {
    return (
      Math.abs(positionY - startLocationY) <= Math.abs(deltaY) ||
      Math.abs(positionX - startLocationX) <= Math.abs(deltaX)
    );
  };

  core.effect.Animate.start(
    stepCallback,
    verifyCallback,
    scrollingComplete,
    speed,
    easingMethod
  );
}

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

  const isCurrentview = dom => {
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
