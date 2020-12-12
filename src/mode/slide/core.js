import { installResizeDetection } from 'core/third-party/resize-detector/index';
import mixins from './mixins';

export default {
  mixins,
  mounted() {
    this.$nextTick(() => {
      if (!this._isDestroyed && !this.renderError) {
        this.updatedCbs.push(() => {
          this.updateScroller();
        });

        this.$watch('mergedOptions.vuescroll.scroller.disable', {
          sync: true,
          handler(newVal) {
            if (this.scroller) {
              this.scroller.__disable = newVal;
            }
          }
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
      return this.getCurrentviewDomSlide();
    },
    internalScrollTo(destX, destY, speed, sasing) {
      this.slideScrollTo(destX, destY, speed, sasing);
    },
    handleScroll(nativeEvent) {
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
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
    getScrollProcess() {
      let {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft
      } = this.scrollPanelElm;

      scrollHeight = this.scroller.__contentHeight;
      scrollWidth = this.scroller.__contentWidth;
      scrollTop = this.scroller.__scrollTop;
      scrollLeft = this.scroller.__scrollLeft;
      clientHeight = this.$el.clientHeight;
      clientWidth = this.$el.clientWidth;

      const v = Math.min(scrollTop / (scrollHeight - clientHeight || 1), 1);
      const h = Math.min(scrollLeft / (scrollWidth - clientWidth || 1), 1);

      return {
        v,
        h
      };
    },
    emitEvent(eventType, nativeEvent = null) {
      const vertical = {
        type: 'vertical'
      };
      const horizontal = {
        type: 'horizontal'
      };
      const { scrollTop, scrollLeft } = this.getPosition();
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
      this.destroyScroller = this.registryScroller(initPos);
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

        // Since content sie changes, we should tell parent to set
        // correct size to fit content's size
        this.setVsSize();
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
    },
    getPosition() {
      return this.getSlidePosition();
    }
  }
};
