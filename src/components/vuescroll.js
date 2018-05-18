import { listenResize } from '../third-party/resize-detector';
import hackLifecycle from '../mixins/hack-lifecycle';
import api from '../mixins/api';
import nativeMode from '../mixins/mode/native-mode';
import slideMode from '../mixins/mode/slide-mode';

import bar, { createBar } from './child-components/vuescroll-bar';
import rail, { createRail } from './child-components/vuescroll-rail';
import scrollContent from './child-components/vuescroll-content';
import scrollPanel, { createPanel } from './child-components/vuescroll-panel';

import { smallChangeArray } from '../shared/constants';
import { isChildInParent } from '../util';

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

const vueScrollCore = {
  name: 'vueScroll',
  components: { bar, rail, scrollContent, scrollPanel },
  props: { ops: { type: Object } },
  mixins: [hackLifecycle, api, nativeMode, slideMode],
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
          timeoutId: 0,
          internalScrollTop: 0,
          internalScrollLeft: 0,
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
      class: 'vue-scroll',
      on: {
        mouseenter() {
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
        },
        mouseleave() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        mousemove() /* istanbul ignore next */ {
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
        }
      }
    };
    return (
      <div {...vuescrollData}>
        {createPanel(h, vm)}
        {createRail(h, vm, 'vertical')}
        {createBar(h, vm, 'vertical')}
        {createRail(h, vm, 'horizontal')}
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
    }
  },
  methods: {
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (this.mode == 'native' || this.mode == 'pure-native') {
        this.updateNativeModeBarState();
      } else if (this.mode == 'slide') {
        this.updateSlideModeBarState();
      }
      if (eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
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
      this.showAndDefferedHideBar();
    },
    setBarClick(val) {
      /* istanbul ignore next */
      this.vuescroll.state.isClickingBar = val;
    },
    showAndDefferedHideBar() {
      this.showBar();
      if (this.vuescroll.state.timeoutId) {
        clearTimeout(this.vuescroll.state.timeoutId);
      }
      this.vuescroll.state.timeoutId = setTimeout(() => {
        this.vuescroll.state.timeoutId = 0;
        this.hideBar();
      }, 500);
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
        this.showAndDefferedHideBar();
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
        this.showAndDefferedHideBar();
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
      this.vuescroll.state.height = parentElm.clientHeight + 'px';
      this.vuescroll.state.width = parentElm.clientWidth + 'px';
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
      let axis = findValuesByMode(mode, this);
      this.vuescroll.state.internalScrollLeft = axis.x;
      this.vuescroll.state.internalScrollTop = axis.y;
    },
    initWatch() {
      const watchOpts = {
        deep: true,
        sync: true
      };
      this.$watch(
        'mergedOptions',
        () => {
          // record current position
          this.recordCurrentPos();
          this.$nextTick(() => {
            if (this.isSmallChangeThisTick == true) {
              this.isSmallChangeThisTick = false;
              return;
            }
            // re do them jobsin case of
            // option changes
            this.registryResize();
            this.updateMode();
            this.setVsSize();
          });
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
    // check whether there is a
    // hash in url or not, if true
    // scroll to the hash automatically
    scrollToHash() /* istanbul ignore next */ {
      const hash = window.location.hash;
      if (!hash) {
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
    }
  },
  mounted() {
    if (!this.renderError) {
      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller();
      }
      this.$el._isVuescroll = true;

      this.lastMode = this.mode;

      this.registryResize();
      this.initWatch();
      this.setVsSize();
      this.updateBarStateAndEmitEvent();
      this.showAndDefferedHideBar();

      this.scrollToHash();
    }
  },
  updated() {
    this.$nextTick(() => {
      if (!this._isDestroyed) {
        this.showAndDefferedHideBar();
      }
    });
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
  }
};

export default vueScrollCore;
