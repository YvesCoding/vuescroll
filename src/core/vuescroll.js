import nativeMode from './mixins/native-mode';
import slideMode from './mixins/slide-mode';

import hackLifecycle from './mixins/hack-lifecycle';

import api from './mixins/api';

import bar, { createBar } from './children/vuescroll-bar';
import scrollContent from './children/vuescroll-content';
import scrollPanel, { createPanel } from './children/vuescroll-panel';

import {
  isSupportTouch,
  insertChildrenIntoSlot,
  isChildInParent
} from '../util';

import { smallChangeArray } from '../shared/constants';

import { installResizeDetection } from '../third-party/resize-detector';

/**
 * Resolve coordinate by mode
 * @param {*} mode
 * @param {*} vm
 */
function resolveOffset(mode, vm) {
  let axis = {};
  switch (mode) {
  case 'native':
    axis = {
      x: vm.scrollPanelElm.scrollLeft,
      y: vm.scrollPanelElm.scrollTop
    };
    break;
  case 'slide':
    axis = { x: vm.scroller.__scrollLeft, y: vm.scroller.__scrollTop };
    break;
  }
  return axis;
}

export default {
  name: 'vueScroll',
  components: { bar, scrollContent, scrollPanel },
  props: {
    ops: { type: Object }
  },
  mixins: [
    /** Hack lifecycle to merge options*/
    hackLifecycle,
    api,
    nativeMode,
    slideMode
  ],
  data() {
    return {
      vuescroll: {
        state: {
          isDragging: false,
          pointerLeave: true,
          /** Internal states to record current positions */
          internalScrollTop: 0,
          internalScrollLeft: 0,
          /** Current scrolling directions */
          posX: null,
          posY: null,
          /** Default tips of refresh and load */
          refreshStage: 'deactive',
          loadStage: 'deactive',
          /** Default sizeStrategies */
          height: '100%',
          width: '100%',
          /** How many times you have scrolled */
          scrollingTimes: 0
        },
        updatedCbs: []
      },

      bar: {
        vBar: {
          state: {
            posValue: 0,
            size: 0,
            opacity: 0
          }
        },
        hBar: {
          state: {
            posValue: 0,
            size: 0,
            opacity: 0
          }
        }
      },

      renderError: false
    };
  },

  mounted() {
    if (!this.renderError) {
      this.initVariables();
      this.initWatchOpsChange();
      this.refreshInternalStatus();

      this.$nextTick(() => {
        if (!this._isDestroyed) {
          // update again to ensure bar's size is correct.
          this.updateBarStateAndEmitEvent();
          // update scroller again since we get real dom.
          if (this.mode == 'slide') {
            this.updateScroller();
          }
          this.scrollToAnchor();
        }
      });
    }
  },
  updated() {
    this.vuescroll.updatedCbs.forEach(cb => {
      cb.call(this);
    });
    // Clear
    this.vuescroll.updatedCbs = [];
  },
  beforeDestroy() {
    // remove registryed resize event
    if (this.destroyParentDomResize) {
      this.destroyParentDomResize();
      this.destroyParentDomResize = null;
    }
    if (this.destroyResize) {
      this.destroyResize();
      this.destroyResize = null;
    }
  },

  render(h) {
    let vm = this;
    if (vm.renderError) {
      return <div>{[vm.$slots['default']]}</div>;
    }
    // vuescroll data
    const vuescrollData = {
      style: {
        height: vm.vuescroll.state.height,
        width: vm.vuescroll.state.width,
        padding: 0
      },
      class: '__vuescroll'
    };

    if (!isSupportTouch()) {
      vuescrollData.on = {
        mouseenter() {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();
        },
        mouseleave() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        mousemove() /* istanbul ignore next */ {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();
        }
      };
    } /* istanbul ignore next */ else {
      vuescrollData.on = {
        touchstart() {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();
        },
        touchend() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        touchmove() /* istanbul ignore next */ {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();
        }
      };
    }

    const _customContainer = this.$slots['scroll-container'];

    const ch = [
      createPanel(h, vm),
      createBar(h, vm, 'vertical'),
      createBar(h, vm, 'horizontal')
    ];

    if (_customContainer) {
      return insertChildrenIntoSlot(h, _customContainer, ch, vuescrollData);
    }

    return <div {...vuescrollData}>{ch}</div>;
  },

  /** ------------------------------- Computed ----------------------------- */
  computed: {
    scrollPanelElm() {
      return this.$refs['scrollPanel']._isVue
        ? this.$refs['scrollPanel'].$el
        : this.$refs['scrollPanel'];
    },
    scrollContentElm() {
      return this.$refs['scrollContent']._isVue
        ? this.$refs['scrollContent'].$el
        : this.$refs['scrollContent'];
    },
    mode() {
      return this.mergedOptions.vuescroll.mode;
    },
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

  /** ------------------------------- Methods -------------------------------- */
  methods: {
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (this.mode == 'native') {
        this.updateNativeModeBarState();
      } else if (this.mode == 'slide') {
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

    /** ------------------------ Handlers --------------------------- */
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    scrollingComplete() {
      this.vuescroll.state.scrollingTimes++;
      this.updateBarStateAndEmitEvent('handle-scroll-complete');
    },
    setBarDrag(val) {
      /* istanbul ignore next */
      this.vuescroll.state.isDragging = val;
    },

    /** ------------------------ Some Helpers --------------------------- */
    /**
     * We don't want it to be computed because computed
     * will cache the result and we don't want to cache the result and always
     * get the fresh.
     */
    isEnableLoad() {
      // Enable load only when clientHeight <= scrollHeight
      if (!this._isMounted) return false;
      const panelElm = this.scrollPanelElm;
      const containerElm = this.$el;

      /* istanbul ignore if */
      if (!this.mergedOptions.vuescroll.pushLoad.enable) {
        return false;
      }

      let loadDom = null;
      if (this.$refs['loadDom']) {
        loadDom = this.$refs['loadDom'].elm || this.$refs['loadDom'];
      }

      const loadHeight = (loadDom && loadDom.offsetHeight) || 0;
      /* istanbul ignore if */
      if (panelElm.scrollHeight - loadHeight <= containerElm.clientHeight) {
        return false;
      }

      return true;
    },
    /* 
     * To have a good ux, instead of hiding bar immediately, we hide bar
     * after some seconds by using this simple debounce-hidebar method.
     */
    showAndDefferedHideBar(forceHideBar) {
      this.showBar();

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }

      this.timeoutId = setTimeout(() => {
        this.timeoutId = 0;
        this.hideBar(forceHideBar);
      }, this.mergedOptions.bar.showDelay);
    },
    showBar() {
      const opacity = this.mergedOptions.bar.opacity;
      this.bar.vBar.state.opacity = opacity;
      this.bar.hBar.state.opacity = opacity;
    },
    hideBar(forceHideBar) {
      // when in non-native mode dragging content
      // in slide mode, just return
      /* istanbul ignore next */
      if (this.vuescroll.state.isDragging) {
        return;
      }

      if (forceHideBar && !this.mergedOptions.bar.keepShow) {
        this.bar.hBar.state.opacity = 0;
        this.bar.vBar.state.opacity = 0;
      }

      // add isDragging condition
      // to prevent from hiding bar while dragging the bar
      if (
        !this.mergedOptions.bar.keepShow &&
        !this.vuescroll.state.isDragging &&
        this.vuescroll.state.pointerLeave
      ) {
        this.bar.vBar.state.opacity = 0;
        this.bar.hBar.state.opacity = 0;
      }
    },
    recordCurrentPos() {
      let mode = this.mode;
      if (this.mode !== this.lastMode) {
        mode = this.lastMode;
        this.lastMode = this.mode;
      }

      const state = this.vuescroll.state;
      let axis = resolveOffset(mode, this);
      const oldX = state.internalScrollLeft;
      const oldY = state.internalScrollTop;

      state.posX =
        oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;

      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
    },
    useNumbericSize() {
      const parentElm = this.$el.parentNode;
      const { position } = parentElm.style;
      if (!position || position == 'static') {
        this.$el.parentNode.style.position = 'relative';
      }

      this.vuescroll.state.height = parentElm.offsetHeight + 'px';
      this.vuescroll.state.width = parentElm.offsetWidth + 'px';
    },
    usePercentSize() {
      this.vuescroll.state.height = '100%';
      this.vuescroll.state.width = '100%';
    },
    // Set its size to be equal to its parentNode
    setVsSize() {
      if (this.mergedOptions.vuescroll.sizeStrategy == 'number') {
        this.useNumbericSize();
        this.registryParentResize();
      } else if (this.mergedOptions.vuescroll.sizeStrategy == 'percent') {
        if (this.destroyParentDomResize) {
          this.destroyParentDomResize();
          this.destroyParentDomResize = null;
        }
        this.usePercentSize();
      }
    },

    /** ------------------------ Init --------------------------- */
    initWatchOpsChange() {
      const watchOpts = {
        deep: true,
        sync: true
      };
      this.$watch(
        'mergedOptions',
        () => {
          // record current position
          this.recordCurrentPos();
          setTimeout(() => {
            if (this.isSmallChangeThisTick == true) {
              this.isSmallChangeThisTick = false;
              this.updateBarStateAndEmitEvent('options-change');
              return;
            }
            this.refreshInternalStatus();
          }, 0);
        },
        watchOpts
      );

      /**
       * We also watch `small` changes, and when small changes happen, we send
       * a signal to vuescroll, to tell it:
       * 1. we don't need to registry resize
       * 2. we don't need to registry scroller.
       */
      smallChangeArray.forEach(opts => {
        this.$watch(
          opts,
          () => {
            this.isSmallChangeThisTick = true;
          },
          watchOpts
        );
      });
    },
    // scrollTo hash-anchor while mounted component have mounted.
    scrollToAnchor() /* istanbul ignore next */ {
      const validateHashSelector = function(hash) {
        return /^#[a-zA-Z_]\d*$/.test(hash);
      };

      let hash = window.location.hash;
      if (
        !hash ||
        ((hash = hash.slice(hash.lastIndexOf('#'))) &&
          !validateHashSelector(hash))
      ) {
        return;
      }

      const elm = document.querySelector(hash);
      if (
        !isChildInParent(elm, this.$el) ||
        this.mergedOptions.scrollPanel.initialScrollY ||
        this.mergedOptions.scrollPanel.initialScrollX
      ) {
        return;
      }

      this.scrollIntoView(elm);
    },
    initVariables() {
      this.lastMode = this.mode;
      this.$el._isVuescroll = true;
      this.clearScrollingTimes();
    },

    /** ------------------------ Refresh When data changes --------------------------- */
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

    /** ------------------------ Registry Resize --------------------------- */
    registryResize() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }

      let contentElm = null;
      if (this.mode == 'slide') {
        contentElm = this.scrollPanelElm;
      } else if (this.mode == 'native') {
        // scrollContent maybe a vue-component or a pure-dom
        contentElm = this.scrollContentElm;
      }

      const handleWindowResize = function() /* istanbul ignore next */ {
        this.updateBarStateAndEmitEvent('window-resize');
        if (this.mode == 'slide') {
          this.vuescroll.updatedCbs.push(this.updateScroller);
          this.$forceUpdate();
        }
      };
      const handleDomResize = () => {
        let currentSize = {};
        if (this.mode == 'slide') {
          currentSize['width'] = this.scroller.__contentWidth;
          currentSize['height'] = this.scroller.__contentHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
          // update scroller should after rendering
          this.vuescroll.updatedCbs.push(this.updateScroller);
          this.$forceUpdate();
        } else if (this.mode == 'native') {
          currentSize['width'] = this.scrollPanelElm.scrollWidth;
          currentSize['height'] = this.scrollPanelElm.scrollHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
        }
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
    },
    registryParentResize() {
      const resizeEnable = this.mergedOptions.vuescroll.detectResize;
      this.destroyParentDomResize = resizeEnable
        ? installResizeDetection(this.$el.parentNode, this.useNumbericSize)
        : () => {};
    }
  }
};
