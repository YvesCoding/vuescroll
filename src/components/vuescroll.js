/* ------------------- Mix Start ---------------- */

/**
 *  Mode mix
 */
import nativeMode from '../mixins/mode/native-mode';
import slideMode from '../mixins/mode/slide-mode';

/**
 *  Lifecycle mix
 */
import hackLifecycle from '../mixins/hack-lifecycle';

/**
 *  Init
 */
import init from '../mixins/init';

/**
 *  Api
 */
import api from '../mixins/api';

/**
 *  Computed
 */
import computed from '../mixins/computed';

/**
 *  Event Hander
 */
import eventHelper from '../mixins/event-handler';

/**
 *  Helper
 */
import helper from '../mixins/helper';

/**
 *  Event Emitter
 */
import eventEmitter from '../mixins/event-emitter';

/**
 *  Refresh Mechanism
 */
import refresh from '../mixins/refresh';

/**
 *  Detect Resize Mechanism
 */
import resize from '../mixins/resize';

/* ------------------- Mix End ---------------- */

/**
 *  Components
 */
import bar, { createBar } from './child-components/vuescroll-bar';
import scrollContent from './child-components/vuescroll-content';
import scrollPanel, { createPanel } from './child-components/vuescroll-panel';

/**
 *  Util
 */
import { isSupportTouch, insertChildrenIntoSlot } from '../util';

const vueScrollCore = {
  name: 'vueScroll',
  components: { bar, scrollContent, scrollPanel },
  props: {
    ops: { type: Object }
  },
  mixins: [
    hackLifecycle,
    api,
    nativeMode,
    slideMode,
    computed,
    eventEmitter,
    eventHelper,
    helper,
    init,
    refresh,
    resize
  ],
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
      }, 0);
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
    const customContainer = this.$slots['scroll-container'];
    const ch = [
      createPanel(h, vm),
      createBar(h, vm, 'vertical'),
      createBar(h, vm, 'horizontal')
    ];

    if (customContainer) {
      return insertChildrenIntoSlot(h, customContainer, ch, vuescrollData);
    }
    return <div {...vuescrollData}>{ch}</div>;
  }
};

export default vueScrollCore;
