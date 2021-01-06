/**
 * These mixes is exclusive for native mode
 */

export default {
  methods: {
    updateNativeModeBarState() {
      const container = this.scrollPanelElm;
      const isPercent = this.vuescroll.state.currentSizeStrategy == 'percent';
      const { width, height } = this.vuescroll.state;
      const clientWidth =
        isPercent || !width ? container.clientWidth : width.slice(0, -2); // xxxpx ==> xxx
      const clientHeight =
        isPercent || !height ? container.clientHeight : height.slice(0, -2);

      let heightPercentage = clientHeight / container.scrollHeight;
      let widthPercentage = clientWidth / container.scrollWidth;

      this.bar.vBar.state.posValue = (container.scrollTop * 100) / clientHeight;
      this.bar.hBar.state.posValue = (container.scrollLeft * 100) / clientWidth;

      this.bar.vBar.state.size = heightPercentage < 1 ? heightPercentage : 0;
      this.bar.hBar.state.size = widthPercentage < 1 ? widthPercentage : 0;
    },
    getNativePosition() {
      return {
        scrollTop: this.scrollPanelElm.scrollTop,
        scrollLeft: this.scrollPanelElm.scrollLeft
      };
    },
    css(dom, style) /* istanbul ignore next */ {
      return window.getComputedStyle(dom)[style];
    },
    checkScrollable(e, deltaX, deltaY) /* istanbul ignore next */ {
      let scrollable = false;

      // check mouse point scrollable.
      let dom = e.target ? e.target : e;
      while (
        dom &&
        dom.nodeType == 1 &&
        dom !== this.scrollPanelElm.parentNode &&
        !/^BODY|HTML/.test(dom.nodeName)
      ) {
        const ov = this.css(dom, 'overflow') || '';
        if (/scroll|auto/.test(ov)) {
          const { v, h } = this.getScrollProcess(dom);
          const isScrollX = this.css(dom, 'overflowX') !== 'hidden';
          const isScrollY = this.css(dom, 'overflowY') !== 'hidden';
          if (
            isScrollX && ((deltaX < 0 && h > 0) || (deltaX > 0 && h < 1)) ||
            isScrollY && ((deltaY < 0 && v > 0) || (deltaY > 0 && v < 1))
          ) {
            scrollable = dom == this.scrollPanelElm;
            break;
          }
        }
        dom = dom.parentNode ? dom.parentNode : false;
      }

      return scrollable;
    },
    onMouseWheel(event) /* istanbul ignore next */ {
      const {
        wheelDirectionReverse: isReverse,
        wheelScrollDuration: duration,
        checkShiftKey,
        locking
      } = this.mergedOptions.vuescroll;

      let deltaX;
      let deltaY;
      if (event.wheelDelta) {
        if (event.deltaY || event.deltaX) {
          deltaX = event.deltaX;
          deltaY = event.deltaY;
          if (locking) {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
              deltaY = 0;
            } else {
              deltaX = 0;
            }
          }
        } else {
          deltaX = 0;
          deltaY = (-1 * event.wheelDelta) / 2;
        }
      } else if (event.detail) {
        deltaY = deltaX = event.detail * 16;
        // horizontal scroll
        if (event.axis == 1) {
          deltaY = 0;
        } else if (event.axis == 2) {
          // vertical scroll
          deltaX = 0;
        }
      }

      if (checkShiftKey && event.shiftKey) {
        // swap value
        deltaX ^= deltaY;
        deltaY ^= deltaX;
        deltaX ^= deltaY;
      }

      if (isReverse) {
        deltaX ^= deltaY;
        deltaY ^= deltaX;
        deltaX ^= deltaY;
      }

      if (this.checkScrollable(event, deltaX, deltaY)) {
        event.stopPropagation();
        event.preventDefault();
        this.scrollBy({ dx: deltaX, dy: deltaY }, duration);
      }
    }
  },
  computed: {
    scrollContentElm() {
      return this.$refs['scrollContent']._isVue
        ? this.$refs['scrollContent'].$el
        : this.$refs['scrollContent'];
    }
  }
};
