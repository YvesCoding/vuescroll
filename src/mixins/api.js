import {
  createEasingFunction,
  easingPattern
} from '../third-party/easingPattern';
import { core } from '../third-party/scroller/animate';
import { warn, isChildInParent } from '../util';

function getNumericValue(distance, size) {
  let number;
  if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = size * number / 100;
  }
  return number;
}

function goScrolling(elm, deltaX, deltaY, speed, easing, scrollingComplete) {
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

export default {
  methods: {
    // public api
    scrollTo({ x, y }, animate = true, force = false) {
      if (typeof x === 'undefined') {
        x = this.vuescroll.state.internalScrollLeft || 0;
      } else {
        x = getNumericValue(x, this.scrollPanelElm.scrollWidth);
      }
      if (typeof y === 'undefined') {
        y = this.vuescroll.state.internalScrollTop || 0;
      } else {
        y = getNumericValue(y, this.scrollPanelElm.scrollHeight);
      }
      this.internalScrollTo(x, y, animate, force);
    },
    scrollBy({ dx = 0, dy = 0 }, animate = true) {
      let {
        internalScrollLeft = 0,
        internalScrollTop = 0
      } = this.vuescroll.state;
      if (dx) {
        internalScrollLeft += getNumericValue(
          dx,
          this.scrollPanelElm.scrollWidth
        );
      }
      if (dy) {
        internalScrollTop += getNumericValue(
          dy,
          this.scrollPanelElm.scrollHeight
        );
      }
      this.internalScrollTo(internalScrollLeft, internalScrollTop, animate);
    },
    zoomBy(factor, animate, originLeft, originTop, callback) {
      if (this.mode != 'slide') {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomBy(factor, animate, originLeft, originTop, callback);
    },
    zoomTo(level, animate = false, originLeft, originTop, callback) {
      if (this.mode != 'slide') {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
    },
    getCurrentPage() {
      if (this.mode != 'slide' || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      return this.scroller.getCurrentPage();
    },
    goToPage(dest, animate = false) {
      if (this.mode != 'slide' || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      this.scroller.goToPage(dest, animate);
    },
    triggerRefreshOrLoad(type) {
      if (this.mode != 'slide') {
        warn('You can only use triggerRefreshOrLoad in slide mode!');
        return;
      }
      const isRefresh = this.mergedOptions.vuescroll.pullRefresh.enable;
      const isLoad = this.mergedOptions.vuescroll.pushLoad.enable;
      if (type == 'refresh' && !isRefresh) {
        warn('refresh must be enabled!');
        return;
      } else if (type == 'load' && !isLoad) {
        warn('load must be enabled!');
        return;
      } else if (type !== 'refresh' && type !== 'load') {
        warn('param must be one of load and refresh!');
        return;
      }
      /* istanbul ignore if */
      if (this.vuescroll.state[`${type}Stage`] == 'start') {
        return;
      }
      this.scroller.triggerRefreshOrLoad(type);
      return true;
    },
    getCurrentviewDom() {
      const parent =
        this.mode == 'slide' || this.mode == 'pure-native'
          ? this.scrollPanelElm
          : this.scrollContentElm;
      const children = parent.children;
      const domFragment = [];
      const isCurrentview = dom => {
        const { left, top, width, height } = dom.getBoundingClientRect();
        const {
          left: parentLeft,
          top: parentTop,
          height: parentHeight,
          width: parentWidth
        } = this.$el.getBoundingClientRect();
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
    },
    // private api
    internalScrollTo(destX, destY, animate, force) {
      if (this.mode == 'native' || this.mode == 'pure-native') {
        if (animate) {
          // hadnle for scroll complete
          const scrollingComplete = () => {
            this.updateBarStateAndEmitEvent('handle-scroll-complete');
          };
          goScrolling(
            this.$refs['scrollPanel'].$el,
            destX - this.$refs['scrollPanel'].$el.scrollLeft,
            destY - this.$refs['scrollPanel'].$el.scrollTop,
            this.mergedOptions.scrollPanel.speed,
            this.mergedOptions.scrollPanel.easing,
            scrollingComplete
          );
        } else {
          this.$refs['scrollPanel'].$el.scrollTop = destY;
          this.$refs['scrollPanel'].$el.scrollLeft = destX;
        }
      }
      // for non-native we use scroller's scorllTo
      else if (this.mode == 'slide') {
        this.scroller.scrollTo(destX, destY, animate, undefined, force);
      }
    },
    scrollIntoView(elm, animate = true) {
      const parentElm = this.$el;
      if (typeof elm === 'string') {
        elm = parentElm.querySelector(elm);
      }
      if (!isChildInParent(elm, parentElm)) {
        warn(
          'The element or selector you passed is not the element of Vuescroll, please pass the element that is in Vuescroll to scrollIntoView API. '
        );
        return;
      }
      // parent elm left, top
      const { left, top } = this.$el.getBoundingClientRect();
      // child elm left, top
      const { left: childLeft, top: childTop } = elm.getBoundingClientRect();

      const diffX = left - childLeft;
      const diffY = top - childTop;

      this.scrollBy(
        {
          dx: -diffX,
          dy: -diffY
        },
        animate
      );
    }
  }
};
