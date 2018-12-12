import { goScrolling, getCurrentViewportDom } from 'mode/shared/util';
import { getNumericValue, warn } from 'shared/util';

export function scrollTo(
  elm,
  x,
  y,
  speed = 300,
  easing,
  animate = true,
  scrollingComplete
) {
  let scrollLeft,
    scrollTop,
    scrollHeight,
    scrollWidth,
    clientWidth,
    clientHeight;

  const { nodeType } = elm;

  if (!nodeType) {
    warn(
      'You must pass a dom for the first param, ' +
        'for window scrolling, ' +
        'you can pass document as the first param.'
    );

    return;
  }

  if (nodeType == 9) {
    // document
    elm = elm.scrollingElement;
  } else {
    elm.parentNode.classList.add('scrolling');
  }

  ({
    scrollLeft,
    scrollTop,
    scrollHeight,
    scrollWidth,
    clientWidth,
    clientHeight
  } = elm);

  if (typeof x === 'undefined') {
    x = scrollLeft;
  } else {
    x = getNumericValue(x, scrollWidth - clientWidth);
  }
  if (typeof y === 'undefined') {
    y = scrollTop;
  } else {
    y = getNumericValue(y, scrollHeight - clientHeight);
  }

  if (animate) {
    goScrolling(
      x,
      y,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      speed,
      easing,
      scrollingComplete,
      (x, y) => {
        elm.scrollLeft = x;
        elm.scrollTop = y;
      }
    );
  } else {
    elm.scrollTop = y;
    elm.scrollLeft = x;
  }
}

export default {
  methods: {
    nativeScrollTo(x, y, animate) {
      scrollTo(
        this.scrollPanelElm,
        x,
        y,
        this.mergedOptions.scrollPanel.speed,
        this.mergedOptions.scrollPanel.easing,
        animate,
        this.scrollingComplete.bind(this)
      );
    },

    getCurrentviewDomNative() {
      const parent = this.scrollContentElm;
      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
