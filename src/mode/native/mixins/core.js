import { installResizeDetection } from 'core/third-party/resize-detector/index';
import api from './api';
import updateNative from './update-native';

export default {
  mixins: [api, updateNative],
  methods: {
    destroy() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        this.destroyResize();
      }
    },
    getCurrentviewDom() {
      this.getCurrentviewDomNaitve();
    },
    internalScrollTo(destX, destY, animate) {
      this.nativeScrollTo(destX, destY, animate);
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
      this.recordNativeCurrentPos();
    },

    initVariables() {
      this.$el._isVuescroll = true;
      this.clearScrollingTimes();
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
      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
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
      };
      window.addEventListener('resize', handleWindowResize, false);

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
