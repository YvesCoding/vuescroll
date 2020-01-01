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
    checkScrollable(e, dir, delta) /* istanbul ignore next */ {
      let scrollable = false;

      // check mouse point scrollable.
      let dom = e.target ? e.target : e;
      while (
        dom &&
        dom.nodeType == 1 &&
        dom !== this.scrollPanelElm.parentNode &&
        !/^BODY|HTML/.test(dom.nodeName)
      ) {
        const ov =
          (dir == 'dy'
            ? this.css(dom, 'overflowY')
            : this.css(dom, 'overflowX')) ||
          this.css(dom, 'overflow') ||
          '';
        if (/scroll|auto/.test(ov)) {
          const { v, h } = this.getScrollProcess(dom);
          if (
            (dir == 'dx' && ((delta < 0 && h > 0) || (delta > 0 && h < 1))) ||
            (dir == 'dy' && ((delta < 0 && v > 0) || (delta > 0 && v < 1)))
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
      const duration = this.mergedOptions.vuescroll.wheelScrollDuration;
      const isReverse = this.mergedOptions.vuescroll.wheelDirectionReverse;

      let delta = 0;
      let dir;
      if (event.wheelDelta) {
        if (event.deltaY) {
          dir = 'dy';
          delta = event.deltaY;
        } else if (event.deltaX) {
          delta = event.deltaX;
          dir = 'dx';
        } else {
          delta = (-1 * event.wheelDelta) / 2;
        }
      } else if (event.detail) {
        // horizontal scroll
        if (event.axis == 1) {
          dir = 'dx';
        } else if (event.axis == 2) {
          // vertical scroll
          dir = 'dy';
        }
        delta = event.detail * 16;
      }

      if (event.shiftKey) {
        dir = 'dx';
      } else {
        dir = 'dy';
      }

      if (isReverse) {
        dir = dir == 'dx' ? 'dy' : 'dx';
      }

      if (this.checkScrollable(event, dir, delta)) {
        event.stopPropagation();
        event.preventDefault();

        this.scrollBy({ [dir]: delta }, duration);
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
