import { h } from 'vue';
import {
  mergeObject,
  defineReactive,
  baseConfig as GCF,
  validateOps,
  TouchManager,
  isChildInParent,
  insertChildrenIntoSlot,
  extendOpts
} from 'shared';
import api, { refreshAll } from './mixins/api';
import ScrollPanel from './components/panel';
import Scrollbar, { createBar } from './components/bar';

/**
 * This is like a HOC, It extracts the common parts of the
 * native-mode, slide-mode and mix-mode.
 * Each mode must implement the following methods:
 * 1. refreshInternalStatus : use to refresh the component
 * 2. destroy : Destroy some registryed events before component destroy.
 * 3. updateBarStateAndEmitEvent: use to update bar states and emit events.
 */

const createComponent = ({ render, mixins }) => {
  const components = {
    [ScrollPanel.name]: ScrollPanel,
    [Scrollbar.name]: Scrollbar
  };

  return {
    name: 'vueScroll',
    emits: [
      'refresh-status',
      'handle-scroll',
      'handle-resize',
      'window-resize',
      'handle-scroll-complete',
      'options-change'
    ],
    props: {
      ops: { type: Object }
    },
    components,
    mixins: [api, ...[].concat(mixins)],
    created() {
      /**
       * Begin to merge options
       */
      const _gfc = mergeObject(this.$vuescrollConfig || {}, {});
      const ops = mergeObject(GCF, _gfc);

      const propsOps = this.ops || {};
      Object.keys(propsOps).forEach((key) => {
        {
          defineReactive(this.mergedOptions, key, propsOps);
        }
      });
      // from ops to mergedOptions
      mergeObject(ops, this.mergedOptions);

      this.$data._isVuescrollRoot = true;
      this.renderError = validateOps(this.mergedOptions);
    },
    render() {
      let vm = this;
      if (vm.renderError) {
        return <div>{[vm.$slots['default']]}</div>;
      }
      // vuescroll data
      const data = {
        style: {
          height: vm.vuescroll.state.height,
          width: vm.vuescroll.state.width,
          padding: 0,
          position: 'relative',
          overflow: 'hidden'
        },
        class: { __vuescroll: true, ...vm.classHooks }
      };

      const touchObj = vm.touchManager.getTouchObject();
      if (touchObj) {
        data[touchObj.touchenter] = function () {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();

          vm.setClassHook('mouseEnter', true);
        };
        data[touchObj.touchleave] = function () {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();

          vm.setClassHook('mouseEnter', false);
        };
        data[touchObj.touchmove] = function () /* istanbul ignore next */ {
          vm.vuescroll.state.pointerLeave = false;
          vm.updateBarStateAndEmitEvent();
        };
      }

      const ch = {
        default: () => [render(vm), ...createBar(vm)]
      };
      const _customContainer = this.$slots['scroll-container'];
      if (_customContainer) {
        return insertChildrenIntoSlot(_customContainer, ch.default, data);
      }

      return h('div', data, ch);
    },
    mounted() {
      if (!this.renderError) {
        this.initVariables();
        this.initWatchOpsChange();
        // Call external merged Api
        this.refreshInternalStatus();

        this.updatedCbs.push(() => {
          this.scrollToAnchor();
          // need to reflow to deal with the
          // latest thing.
          this.updateBarStateAndEmitEvent();
        });
      }
    },
    updated() {
      this.updatedCbs.forEach((cb) => {
        cb.call(this);
      });
      // Clear
      this.updatedCbs = [];
    },
    beforeUnmount() {
      /* istanbul ignore next */
      if (this.destroy) {
        this.destroy();
      }
    },

    /** ------------------------------- Computed ----------------------------- */
    computed: {
      scrollPanelElm() {
        return this.$refs['scrollPanel'].$el;
      }
    },
    data() {
      return {
        touchManager: new TouchManager(),
        vuescroll: {
          state: {
            isDragging: false,
            pointerLeave: true,
            isRailHover: false,
            /** Default sizeStrategies */
            height: '100%',
            width: '100%',
            // current size strategy
            currentSizeStrategy: 'percent',
            currentScrollState: null,
            currentScrollInfo: null
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
          }
        },
        mergedOptions: {
          vuescroll: {},
          scrollPanel: {},
          scrollContent: {},
          rail: {},
          bar: {}
        },
        updatedCbs: [],
        renderError: false,

        classHooks: {
          hasVBar: false,
          hasHBar: false,

          vBarVisible: false,
          hBarVisible: false,

          vBarDragging: false,
          hBarDragging: false,

          clikingVerticalStartButton: false,
          clikingVerticalEndButton: false,
          clikingHorizontalStartButton: false,
          clikingHorizontalEndButton: false,

          mouseEnter: false
        }
      };
    },
    /** ------------------------------- Methods -------------------------------- */
    methods: {
      /** ------------------------ Handlers --------------------------- */

      scrollingComplete() {
        this.updateBarStateAndEmitEvent('handle-scroll-complete');
      },
      setBarDrag(val) {
        /* istanbul ignore next */
        this.vuescroll.state.isDragging = val;
      },
      setClassHook(name, value) {
        this.classHooks[name] = value;
      },

      /** ------------------------ Some Helpers --------------------------- */

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
        const { isDragging, isRailHover } = this.vuescroll.state;
        /* istanbul ignore next */
        if (isDragging || isRailHover) {
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
          !this.vuescroll.state.isDragging
        ) {
          this.bar.vBar.state.opacity = 0;
          this.bar.hBar.state.opacity = 0;
        }
      },
      useNumbericSize() {
        this.vuescroll.state.currentSizeStrategy = 'number';
        const { maxHeight, maxWidth } = this.mergedOptions.scrollPanel;
        const {
          clientHeight: parentClientHeight,
          clientWidth: parentClientWidth
        } = this.$el.parentNode;
        const { scrollHeight, scrollWidth } = this.scrollPanelElm;
        let width;
        let height;

        if (maxHeight || maxWidth) {
          height = scrollHeight <= maxHeight ? undefined : maxHeight;
          width = scrollWidth <= maxWidth ? undefined : maxWidth;
        } else {
          height = parentClientHeight;
          width = parentClientWidth;
        }

        this.vuescroll.state.height = height ? height + 'px' : undefined;
        this.vuescroll.state.width = width ? width + 'px' : undefined;
      },
      usePercentSize() {
        this.vuescroll.state.currentSizeStrategy = 'percent';

        this.vuescroll.state.height = '100%';
        this.vuescroll.state.width = '100%';
      },
      // Set its size to be equal to its parentNode
      setVsSize() {
        const { sizeStrategy } = this.mergedOptions.vuescroll;
        const { maxHeight, maxWidth } = this.mergedOptions.scrollPanel;
        const { clientHeight, clientWidth } = this.scrollPanelElm;
        if (
          sizeStrategy == 'number' ||
          (maxHeight && clientHeight > maxHeight) ||
          (maxWidth && clientWidth > maxWidth)
        ) {
          this.useNumbericSize();
        } else if (
          sizeStrategy == 'percent' &&
          clientHeight != maxHeight &&
          clientWidth != maxWidth
        ) {
          this.usePercentSize();
        }
      },

      /** ------------------------ Init --------------------------- */
      initWatchOpsChange() {
        const watchOpts = {
          deep: true,
          flush: 'sync'
        };

        this.$watch(
          'mergedOptions',
          () => {
            setTimeout(() => {
              if (this.isSmallChangeThisTick) {
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
        this.$watch(
          () => {
            return [
              this.mergedOptions.vuescroll.pullRefresh.tips,
              this.mergedOptions.vuescroll.pushLoad.tips,
              this.mergedOptions.vuescroll.scroller.disable,
              this.mergedOptions.rail,
              this.mergedOptions.bar
            ];
          },
          () => {
            this.isSmallChangeThisTick = true;
          },
          watchOpts
        );
      },
      // scrollTo hash-anchor while mounted component have mounted.
      scrollToAnchor() /* istanbul ignore next */ {
        const validateHashSelector = function (hash) {
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
      }

      /** ------------------------ Registry Resize --------------------------- */
    }
  };
};

export default function _install(
  core,
  render,
  extraConfigs = [],
  extraValidators = []
) {
  const opts = {};
  opts.render = render;
  opts.mixins = core;
  const component = createComponent(opts);

  // Init Config
  extendOpts(extraConfigs, extraValidators);

  return {
    install(Vue, opts = {}) {
      Vue.component(opts.name || component.name, component);
      Vue.config.globalProperties.$vuescrollConfig = opts.ops || {};
    },
    version: '__version__',
    refreshAll,
    ...component
  };
}
