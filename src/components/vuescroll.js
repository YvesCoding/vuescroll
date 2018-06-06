import { listenResize } from '../third-party/resize-detector';
import hackLifecycle from '../mixins/hack-lifecycle';
import api from '../mixins/api';
import nativeMode from '../mixins/mode/native-mode';
import slideMode from '../mixins/mode/slide-mode';

import bar, { createBar } from './child-components/vuescroll-bar';
import scrollContent from './child-components/vuescroll-content';
import scrollPanel, { createPanel } from './child-components/vuescroll-panel';

import { smallChangeArray } from '../shared/constants';
import { isChildInParent, extractNumberFromPx, isSupportTouch } from '../util';

function findValuesByMode(mode, vm) {
  let axis = {};
  switch (mode) {
  case 'native':
  case 'pure-native':
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
/**
 *
 *
 * @param {any} type height or width
 * have been computed in this.useNumbericSize
 * @returns
 */
function getClientSizeByType(type) {
  const vuescroll = this.$el;
  const isPercentStrategy =
    this.mergedOptions.vuescroll.sizeStrategy == 'percent';
  const clientSize = isPercentStrategy
    ? vuescroll[`client${type.charAt(0).toUpperCase() + type.slice(1)}`]
    : extractNumberFromPx(this.vuescroll.state[type]);
  return clientSize - 0;
}

const vueScrollCore = {
  name: 'vueScroll',
  components: { bar, scrollContent, scrollPanel },
  props: { ops: { type: Object } },
  mixins: [hackLifecycle, api, nativeMode, slideMode],
  mounted() {
    if (!this.renderError) {
      this.initVariables();

      this.initWatchOpsChange();

      this.refreshInternalStatus();

      this.$nextTick(() => {
        if (!this._isDestroyed) {
          // update again to make sure bar's size is correct.
          this.updateBarStateAndEmitEvent();
          this.scrollToAnchor();
        }
      }, 0);
    }
  },
  beforeDestroy() {
    // remove registryed resize
    if (this.destroyParentDomResize) {
      this.destroyParentDomResize();
      this.destroyParentDomResize = null;
    }
    if (this.destroyResize) {
      this.destroyResize();
      this.destroyResize = null;
    }
  },
  data() {
    return {
      /**
       * @description
       * In state props of each components, we store the states of each
       * components, and in mergedOptions props, we store the options
       * that are megred from user-defined options to default options.
       * @author wangyi7099
       * @returns
       */
      vuescroll: {
        state: {
          isDragging: false,
          isClickingBar: false,
          pointerLeave: true,
          internalScrollTop: 0,
          internalScrollLeft: 0,
          posX: null,
          posY: null,
          refreshStage: 'deactive',
          loadStage: 'deactive',
          height: '100%',
          width: '100%'
        }
      },
      scrollPanel: {},
      scrollContent: {},
      rail: {
        vRail: {
          state: {}
        },
        hRail: {
          state: {}
        }
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
        },
        renderError: false
      }
    };
  },
  render(h) {
    let vm = this;
    if (vm.renderError) {
      return <div>{[vm.$slots['default']]}</div>;
    }
    // vuescroll data
    const vuescrollData = {
      style: {
        position: 'relative',
        height: vm.vuescroll.state.height,
        width: vm.vuescroll.state.width,
        padding: 0,
        overflow: 'hidden'
      },
      class: 'vue-scroll'
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
    return (
      <div {...vuescrollData}>
        {createPanel(h, vm)}
        {createBar(h, vm, 'vertical')}
        {createBar(h, vm, 'horizontal')}
      </div>
    );
  },
  computed: {
    scrollPanelElm() {
      return this.$refs.scrollPanel.$el;
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
    },
    clientWidth() {
      return getClientSizeByType.call(this, 'width');
    },
    clientHeight() {
      return getClientSizeByType.call(this, 'height');
    }
  },
  methods: {
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (this.mode == 'native' || this.mode == 'pure-native') {
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
      this.showAndDefferedHideBar();
    },
    updateMode() {
      const x = this.vuescroll.state.internalScrollLeft;
      const y = this.vuescroll.state.internalScrollTop;
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller();
      } else if (this.mode == 'native' || this.mode == 'pure-native') {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = '';
        this.scrollPanelElm.style.transformOrigin = '';
      }
      // keep the last-mode's position.
      this.scrollTo({ x, y }, false, true /* force */);
    },
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    setBarClick(val) {
      /* istanbul ignore next */
      this.vuescroll.state.isClickingBar = val;
    },
    showAndDefferedHideBar() {
      this.showBar();
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
      this.timeoutId = setTimeout(() => {
        this.timeoutId = 0;
        this.hideBar();
      }, this.mergedOptions.bar.showDelay);
    },
    /**
     *  emit user registry event
     */
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
        },
        horizontal = {
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
      vertical['directionY'] = this.vuescroll.state.posY;
      horizontal['directionX'] = this.vuescroll.state.posX;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    showBar() {
      this.bar.vBar.state.opacity = this.mergedOptions.bar.vBar.opacity;
      this.bar.hBar.state.opacity = this.mergedOptions.bar.hBar.opacity;
    },
    hideBar() {
      // when in non-native mode dragging content
      // in slide mode, just return
      /* istanbul ignore next */
      if (this.vuescroll.state.isDragging) {
        return;
      }
      // add isClickingBar condition
      // to prevent from hiding bar while dragging the bar
      if (
        !this.mergedOptions.bar.vBar.keepShow &&
        !this.vuescroll.state.isClickingBar &&
        this.vuescroll.state.pointerLeave
      ) {
        this.bar.vBar.state.opacity = 0;
      }
      if (
        !this.mergedOptions.bar.hBar.keepShow &&
        !this.vuescroll.state.isClickingBar &&
        this.vuescroll.state.pointerLeave
      ) {
        this.bar.hBar.state.opacity = 0;
      }
    },
    registryResize() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }
      let contentElm = null;
      if (this.mode == 'slide' || this.mode == 'pure-native') {
        contentElm = this.scrollPanelElm;
      } else if (this.mode == 'native') {
        // scrollContent maybe a component or a pure-dom
        contentElm = this.scrollContentElm;
      }
      const handleWindowResize = () => /* istanbul ignore next */ {
        this.updateBarStateAndEmitEvent();
        if (this.mode == 'slide') {
          this.updateScroller();
        }
      };
      const handleDomResize = () => {
        let currentSize = {};
        if (this.mode == 'slide') {
          this.updateScroller();
          currentSize['width'] = this.scroller.__contentWidth;
          currentSize['height'] = this.scroller.__contentHeight;
        } else if (this.mode == 'native' || this.mode == 'pure-native') {
          currentSize['width'] = this.scrollPanelElm.scrollWidth;
          currentSize['height'] = this.scrollPanelElm.scrollHeight;
        }
        this.updateBarStateAndEmitEvent('handle-resize', currentSize);
      };
      window.addEventListener('resize', handleWindowResize, false);
      const destroyDomResize = listenResize(contentElm, handleDomResize);
      const destroyWindowResize = () => {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();
      };
    },
    registryParentResize() {
      this.destroyParentDomResize = listenResize(
        this.$el.parentNode,
        this.useNumbericSize
      );
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
    // set its size to be equal to its parentNode
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
    recordCurrentPos() {
      let mode = this.mode;
      if (this.mode !== this.lastMode) {
        mode = this.lastMode;
        this.lastMode = this.mode;
      }
      const state = this.vuescroll.state;
      let axis = findValuesByMode(mode, this);
      const oldX = state.internalScrollLeft;
      const oldY = state.internalScrollTop;
      state.posX =
        oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;
      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
    },
    refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize();
      // 2. registry resize event
      this.registryResize();
      // 3. registry scroller if mode is 'slide'
      // or remove 'transform origin' is the mode is not `slide`
      this.updateMode();
      // 4. update scrollbar's height/width
      this.updateBarStateAndEmitEvent();
    },
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
              this.updateBarStateAndEmitEvent();
              return;
            }
            this.refreshInternalStatus();
          }, 0);
        },
        watchOpts
      );

      smallChangeArray.forEach(opts => {
        this.$watch(
          opts,
          () => {
            // when small changes changed,
            // we need not to updateMode or registryResize
            this.isSmallChangeThisTick = true;
          },
          watchOpts
        );
      });
    },
    // scrollTo hash-anchor while mounted
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
    }
  }
};

export default vueScrollCore;
