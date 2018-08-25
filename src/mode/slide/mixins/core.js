import { installResizeDetection } from 'core/third-party/resize-detector/index';
import api from './api';
import updateSlide from './update-slide';

export default {
  mixins: [api, updateSlide],
  mounted() {
    this.$nextTick(() => {
      if (!this._isDestroyed && !this.renderError) {
        // update again to ensure bar's size is correct.
        this.updateBarStateAndEmitEvent();
        // update scroller again since we get real dom.
        this.updateScroller();
        this.scrollToAnchor();
      }
    });
  },
  computed: {
    pullRefreshTip() {
      return this.mergedOptions.vuescroll.pullRefresh.tips[
        this.vuescroll.state.refreshStage
      ];
    },
    pushLoadTip() {
      return this.mergedOptions.vuescroll.pushLoad.tips[
        this.vuescroll.state.loadStage
      ];
    },
    refreshLoad() {
      return (
        this.mergedOptions.vuescroll.pullRefresh.enable ||
        this.mergedOptions.vuescroll.pushLoad.enable
      );
    }
  },
  methods: {
    getCurrentviewDom() {
      this.getCurrentviewDomSlide();
    },
    internalScrollTo(destX, destY, animate, force) {
      this.slideScrollTo(destX, destY, animate, undefined, force);
    },
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (!this.scroller) {
        return;
      }
      this.updateSlideModeBarState();
      if (eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
      if (this.mergedOptions.bar.onlyShowBarOnScroll) {
        if (
          eventType == 'handle-scroll' ||
          eventType == 'handle-resize' ||
          eventType == 'refresh-status' ||
          eventType == 'window-resize' ||
          eventType == 'options-change'
        ) {
          this.showAndDefferedHideBar(true /* forceHideBar: true */);
        }
      } else {
        this.showAndDefferedHideBar();
      }
    },
    emitEvent(eventType, nativeEvent = null) {
      let {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft
      } = this.scrollPanelElm;

      const vertical = {
        type: 'vertical'
      };
      const horizontal = {
        type: 'horizontal'
      };
      scrollHeight = this.scroller.__contentHeight;
      scrollWidth = this.scroller.__contentWidth;
      scrollTop = this.scroller.__scrollTop;
      scrollLeft = this.scroller.__scrollLeft;
      clientHeight = this.$el.clientHeight;
      clientWidth = this.$el.clientWidth;

      vertical['process'] = Math.min(
        scrollTop / (scrollHeight - clientHeight),
        1
      );
      horizontal['process'] = Math.min(
        scrollLeft / (scrollWidth - clientWidth),
        1
      );

      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;
      // Current scroll direction
      vertical['directionY'] = this.vuescroll.state.posY;
      horizontal['directionX'] = this.vuescroll.state.posX;

      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },

    recordCurrentPos() {
      const state = this.vuescroll.state;
      let axis = {
        x: this.scroller.__scrollLeft,
        y: this.scroller.__scrollTop
      };
      const oldX = state.internalScrollLeft;
      const oldY = state.internalScrollTop;

      state.posX =
        oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;

      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
    },

    initVariables() {
      this.$el._isVuescroll = true;
      this.clearScrollingTimes();
    },
    refreshMode() {
      const x = this.vuescroll.state.internalScrollLeft;
      const y = this.vuescroll.state.internalScrollTop;
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      this.destroyScroller = this.registryScroller();
      // keep the last-mode's position.
      this.scrollTo({ x, y }, false, true /* force */);
    },
    refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize();
      // 2. registry resize event
      this.registryResize();
      // 3. registry scroller if mode is 'slide'
      // or remove 'transform origin' is the mode is not `slide`
      this.refreshMode();
      // 4. update scrollbar's height/width
      this.updateBarStateAndEmitEvent('refresh-status');
    },

    registryResize() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }

      let contentElm = this.scrollPanelElm;
      const handleWindowResize = function() /* istanbul ignore next */ {
        this.updateBarStateAndEmitEvent('window-resize');
        this.vuescroll.updatedCbs.push(this.updateScroller);
        this.$forceUpdate();
      };
      const handleDomResize = () => {
        let currentSize = {};
        currentSize['width'] = this.scroller.__contentWidth;
        currentSize['height'] = this.scroller.__contentHeight;
        this.updateBarStateAndEmitEvent('handle-resize', currentSize);
        // update scroller should after rendering
        this.vuescroll.updatedCbs.push(this.updateScroller);
        this.$forceUpdate();
      };
      window.addEventListener('resize', handleWindowResize.bind(this), false);
      const resizeEnable = this.mergedOptions.vuescroll.detectResize;
      const destroyDomResize = resizeEnable
        ? installResizeDetection(contentElm, handleDomResize)
        : () => {};
      const destroyWindowResize = () => {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();
      };
    }
  }
};
