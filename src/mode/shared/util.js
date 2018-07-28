import {
  createEasingFunction,
  easingPattern
} from 'core/third-party/easingPattern/index';
import { core } from 'core/third-party/scroller/animate';
import withBase from 'core/index';

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

export function _init(opts = {}) {
  const comp = (opts._components = opts._components || {});
  opts.components = {};
  comp.forEach(_c => {
    opts.components[_c.name] = _c;
  });

  let vsCtor = withBase(opts.render, opts, opts.Vue);
  initMix(vsCtor, opts.mixins);

  delete opts._components;
  delete opts.mixins;
  delete opts.render;
  delete opts.Vue;
}

export function initMix(ctor, mix) {
  const _mixedArr = flatArray(mix);
  _mixedArr.forEach(_ => ctor.mixin(_));
}

export function flatArray(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatMap(cur) : cur);
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
