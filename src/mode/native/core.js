import { installResizeDetection } from 'core/third-party/resize-detector/index';
import mixins from './mixins';

export default {
  mixins,
  methods: {
    destroy() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        this.destroyResize();
      }
    },
    getCurrentviewDom() {
      return this.getCurrentviewDomNative();
    },
    internalScrollTo(destX, destY, animate, easing) {
      this.nativeScrollTo(destX, destY, animate, easing);
    },
    internalStop() {
      this.nativeStop();
    },
    internalPause() {
      this.nativePause();
    },
    internalContinue() {
      this.nativeContinue();
    },
    handleScroll(nativeEvent) {
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      this.updateNativeModeBarState();
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
    getScrollProcess(elm) {
      let {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft
      } = elm || this.scrollPanelElm;

      const v = Math.min(scrollTop / (scrollHeight - clientHeight || 1), 1);
      const h = Math.min(scrollLeft / (scrollWidth - clientWidth || 1), 1);

      return {
        v,
        h
      };
    },
    emitEvent(eventType, nativeEvent = null) {
      let { scrollTop, scrollLeft } = this.scrollPanelElm;

      const vertical = {
        type: 'vertical'
      };
      const horizontal = {
        type: 'horizontal'
      };

      const { v, h } = this.getScrollProcess();

      vertical.process = v;
      horizontal.process = h;

      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;

      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },

    initVariables() {
      this.$el._isVuescroll = true;
    },
    refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize();
      // 2. registry resize event
      this.registryResize();
      // 3. update scrollbar's height/width
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

      let contentElm = this.scrollContentElm;

      const vm = this;
      const handleWindowResize = function() /* istanbul ignore next */ {
        vm.updateBarStateAndEmitEvent('window-resize');
      };
      const handleDomResize = () => {
        let currentSize = {};
        currentSize['width'] = this.scrollPanelElm.scrollWidth;
        currentSize['height'] = this.scrollPanelElm.scrollHeight;
        this.updateBarStateAndEmitEvent('handle-resize', currentSize);

        // Since content sie changes, we should tell parent to set
        // correct size to fit content's size
        this.setVsSize();
      };
      window.addEventListener('resize', handleWindowResize, false);

      const destroyDomResize = installResizeDetection(
        contentElm,
        handleDomResize
      );

      const destroyWindowResize = () => {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();

        this.destroyResize = null;
      };
    },
    getPosition() {
      return this.getNativePosition();
    }
  }
};
