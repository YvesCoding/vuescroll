import { installResizeDetection } from 'core/third-party/resize-detector/index';
import mixins from './mixins';

export default {
  mixins,
  mounted() {
    if (!this._isDestroyed && !this.renderError) {
      if (this.mode == 'slide') {
        this.updatedCbs.push(this.updateScroller);
      }

      this.$watch(
        () => this.mergedOptions.vuescroll.scroller.disable,
        (newVal) => {
          if (this.scroller) {
            this.scroller.__disable = newVal;
          }
        },
        {
          flush: 'sync'
        }
      );
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
    handleScroll(nativeEvent) {
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
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
    getScrollProcess() {
      let {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft
      } = this.scrollPanelElm;

      if (this.mode == 'slide') {
        scrollHeight = this.scroller.__contentHeight;
        scrollWidth = this.scroller.__contentWidth;
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
        clientHeight = this.$el.clientHeight;
        clientWidth = this.$el.clientWidth;
      }

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
      vertical['process'] = v;
      horizontal['process'] = h;

      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;

      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    initVariables() {
      this.lastMode = this.mode;
      this.$el._isVuescroll = true;
    },
    refreshMode() {
      let initPos;
      if (this.scroller) {
        initPos = this.scroller.getValues();
      }

      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }

      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller(initPos);
      } else if (this.mode == 'native') {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = '';
        this.scrollPanelElm.style.transformOrigin = '';
      }
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
      let modeChanged = false;

      if (this.lastMode != this.mode) {
        modeChanged = true;
        this.lastMode = this.mode;
      }

      /* istanbul ignore next */
      if (this.destroyResize && resizeEnable && !modeChanged) {
        return;
      }

      if (this.destroyResize) {
        this.destroyResize();
      }

      if (!resizeEnable) {
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
      const handleWindowResize = function () /* istanbul ignore next */ {
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
      if (this.mode == 'slide') {
        return this.getSlidePosition();
      } else if (this.mode == 'native') {
        return this.getNativePosition();
      }
    }
  }
};
