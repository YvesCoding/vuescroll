import {
  createEasingFunction,
  easingPattern
} from 'core/third-party/easingPattern/index';
import { core } from 'core/third-party/scroller/animate';
import withBase from 'core/index';
import { extendOpts } from 'shared/global-config';
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
  if (startLocationY + deltaY > maxX) {
    deltaY = maxY - startLocationY;
  }
  if (startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if (startLocationX + deltaX > maxY) {
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
export function _install(opts = {}) {
  let {
    _components,
    render,
    Vue,
    components = {},
    config = {},
    ops = {},
    validator
  } = opts;

  // Init component
  const comp = (_components = _components || {});
  comp.forEach(_ => {
    components[_.name] = _;
  });

  opts.components = components;
  opts.Vue = Vue;
  opts.render = render;

  // Create component
  withBase(opts);

  // Init Config
  extendOpts(config, validator);
  // Inject global config
  Vue.prototype.$vuescrollConfig = ops;
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
