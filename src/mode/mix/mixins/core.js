import { installResizeDetection } from 'core/third-party/resize-detector/index';
import api from './api';
import slideMix from 'mode/slide/mixins/update-slide';
import nativeMix from 'mode/native/mixins/update-native';

export default {
  mixins: [api, slideMix, nativeMix],
  mounted() {
    if (!this._isDestroyed && !this.renderError) {
      if (this.mode == 'slide') {
        this.updatedCbs.push(this.updateScroller);
      }
    }
  },
  computed: {
    mode() {
      return this.mergedOptions.vuescroll.mode;
    }
  },
  methods: {
    destroy() {
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
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (this.mode == 'native') {
        this.updateNativeModeBarState();
      } else if (this.mode == 'slide') {
        /* istanbul ignore if */
        if (!this.scroller) {
          return;
        }

        this.updateSlideModeBarState();
      }
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

      if (this.mode == 'slide') {
        scrollHeight = this.scroller.__contentHeight;
        scrollWidth = this.scroller.__contentWidth;
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
        clientHeight = this.$el.clientHeight;
        clientWidth = this.$el.clientWidth;
      }

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
      let mode = this.mode;
      if (this.mode !== this.lastMode) {
        mode = this.lastMode;
        this.lastMode = this.mode;
      }

      if (mode == 'slide') {
        this.recordSlideCurrentPos();
      } else {
        this.recordNativeCurrentPos();
      }
    },

    initVariables() {
      this.lastMode = this.mode;
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
      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller();
      } else if (this.mode == 'native') {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = '';
        this.scrollPanelElm.style.transformOrigin = '';
      }
      // keep the last-mode's position.
      this.scrollTo({ x, y }, false /* animate */, false /* force */);
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
        return;
      }

      let contentElm = null;
      if (this.mode == 'slide') {
        contentElm = this.scrollPanelElm;
      } else if (this.mode == 'native') {
        // scrollContent maybe a vue-component or a pure-dom
        contentElm = this.scrollContentElm;
      }

      const vm = this;
      const handleWindowResize = function() /* istanbul ignore next */ {
        vm.updateBarStateAndEmitEvent('window-resize');
        if (vm.mode == 'slide') {
          vm.updatedCbs.push(vm.updateScroller);
          vm.$forceUpdate();
        }
      };

      const handleDomResize = () => {
        let currentSize = {};
        if (this.mode == 'slide') {
          currentSize['width'] = this.scroller.__contentWidth;
          currentSize['height'] = this.scroller.__contentHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
          // update scroller should after rendering
          this.updatedCbs.push(this.updateScroller);
          this.$forceUpdate();
        } else if (this.mode == 'native') {
          currentSize['width'] = this.scrollPanelElm.scrollWidth;
          currentSize['height'] = this.scrollPanelElm.scrollHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
        }
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

        this.destroyResize = null;
      };
    }
  }
};
