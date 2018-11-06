import { installResizeDetection } from 'core/third-party/resize-detector/index';
import api from './api';
import updateSlide from './update-slide';

export default {
  mixins: [api, updateSlide],
  mounted() {
    this.$nextTick(() => {
      if (!this._isDestroyed && !this.renderError) {
        this.updatedCbs.push(() => {
          this.updateScroller();
        });
      }
    });
  },
  methods: {
    destroy() {
      /* istanbul ignore next */
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }

      /* istanbul ignore next */
      if (this.destroyResize) {
        this.destroyResize();
      }
    },
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
      this.recordSlideCurrentPos();
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
      const resizeEnable = this.mergedOptions.vuescroll.detectResize;

      /* istanbul ignore next */
      if (this.destroyResize && resizeEnable) {
        return;
      }

      if (this.destroyResize) {
        this.destroyResize();
      }

      if (!resizeEnable) {
        return;
      }

      let contentElm = this.scrollPanelElm;
      const vm = this;
      const handleWindowResize = function() /* istanbul ignore next */ {
        vm.updateBarStateAndEmitEvent('window-resize');
        vm.updatedCbs.push(vm.updateScroller);
        vm.$forceUpdate();
      };

      const handleDomResize = () => {
        let currentSize = {};
        currentSize['width'] = this.scroller.__contentWidth;
        currentSize['height'] = this.scroller.__contentHeight;
        this.updateBarStateAndEmitEvent('handle-resize', currentSize);
        // update scroller should after rendering
        this.updatedCbs.push(this.updateScroller);
        this.$forceUpdate();
      };
      window.addEventListener('resize', handleWindowResize, false);
      const destroyDomResize = resizeEnable
        ? installResizeDetection(contentElm, handleDomResize)
        : NOOP;
      const destroyWindowResize = () => {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();

        this.destroyResize = null;
      };
    }
  }
};
