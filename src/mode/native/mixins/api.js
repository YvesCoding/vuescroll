import { getCurrentViewportDom } from 'mode/shared/util';
import { getNumericValue, warn } from 'shared/util';
import {
  createEasingFunction,
  easingPattern
} from 'core/third-party/easingPattern/index';
import animate from './scrollAnimate';

export function scrollTo(elm, x, y, speed = 300, easing, scrollingComplete) {
  let scrollLeft,
    scrollTop,
    scrollHeight,
    scrollWidth,
    clientWidth,
    clientHeight;

  const { nodeType } = elm;
  const scrollX = new animate();
  const scrollY = new animate();

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

  const easingMethod = createEasingFunction(easing, easingPattern);
  scrollX.startScroll(
    scrollLeft,
    x,
    speed,
    dx => {
      elm.scrollLeft = dx;
    },
    scrollingComplete,
    undefined,
    easingMethod
  );
  scrollY.startScroll(
    scrollTop,
    y,
    speed,
    dy => {
      elm.scrollTop = dy;
    },
    scrollingComplete,
    undefined,
    easingMethod
  );
}

export default {
  mounted() {
    // registry scroll
    this.scrollX = new animate();
    this.scrollY = new animate();
  },
  methods: {
    nativeStop() {
      this.scrollX.stop();
      this.scrollY.stop();
    },
    nativePause() {
      this.scrollX.pause();
      this.scrollY.pause();
    },
    nativeContinue() {
      this.scrollX.continue();
      this.scrollY.continue();
    },
    nativeScrollTo(x, y, speed, easing) {
      if (speed === false) {
        speed == 0;
      } else if (typeof speed === 'undefined') {
        speed = this.mergedOptions.scrollPanel.speed;
      }
      const elm = this.scrollPanelElm;
      const {
        scrollTop,
        scrollLeft,
        scrollWidth,
        clientWidth,
        scrollHeight,
        clientHeight
      } = elm;
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

      if (speed) {
        easing = easing || this.mergedOptions.scrollPanel.easing;
        const easingMethod = createEasingFunction(easing, easingPattern);

        if (x != scrollLeft) {
          this.scrollX.startScroll(
            scrollLeft,
            x,
            speed,
            x => {
              elm.scrollLeft = x;
            },
            this.scrollingComplete.bind(this),
            undefined,
            easingMethod
          );
        }

        if (y != scrollTop) {
          this.scrollY.startScroll(
            scrollTop,
            y,
            speed,
            y => {
              elm.scrollTop = y;
            },
            this.scrollingComplete.bind(this),
            undefined,
            easingMethod
          );
        }
      } else {
        elm.scrollTop = y;
        elm.scrollLeft = x;
      }
    },

    getCurrentviewDomNative() {
      const parent = this.scrollContentElm;
      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
