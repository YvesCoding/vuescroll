import {
  createEasingFunction,
  easingPattern
} from 'core/third-party/easingPattern/index';
import { core } from 'core/third-party/scroller/animate';
import withBase from 'core/index';
import { extendOpts } from 'shared/global-config';
import { isArray } from 'shared/util';
/**
 * Start to scroll to a position
 */
export function goScrolling(
  elm,
  deltaX,
  deltaY,
  speed,
  easing,
  scrollingComplete
) {
  const startLocationY = elm['scrollTop'];
  const startLocationX = elm['scrollLeft'];
  let positionX = startLocationX;
  let positionY = startLocationY;
  /**
   * keep the limit of scroll delta.
   */
  /* istanbul ignore next */
  if (startLocationY + deltaY < 0) {
    deltaY = -startLocationY;
  }
  const scrollHeight = elm['scrollHeight'];
  if (startLocationY + deltaY > scrollHeight) {
    deltaY = scrollHeight - startLocationY;
  }
  if (startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if (startLocationX + deltaX > elm['scrollWidth']) {
    deltaX = elm['scrollWidth'] - startLocationX;
  }

  const easingMethod = createEasingFunction(easing, easingPattern);

  const stepCallback = percentage => {
    positionX = startLocationX + deltaX * percentage;
    positionY = startLocationY + deltaY * percentage;
    elm['scrollTop'] = Math.floor(positionY);
    elm['scrollLeft'] = Math.floor(positionX);
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
 * 3. Mix
 * 4. Config
 */
export function _init(opts = {}) {
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
  comp.forEach(_c => {
    components[_c.name] = _c;
  });

  // Init render
  let vsCtor = withBase(render, Vue, components, opts);
  // Init Mix
  initMix(vsCtor, opts.mixins);
  // Init Config
  extendOpts(config, validator);
  // Inject global config
  Vue.prototype.$vuescrollConfig = ops;
}

function initMix(ctor, mix) {
  const _mixedArr = flatArray(mix);
  _mixedArr.forEach(_ => ctor.mixin(_));
}

function flatArray(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(isArray(cur) ? flatMap(cur) : cur);
  }, []);
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
