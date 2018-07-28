import hackLifecycle from './mixins/hack-lifecycle';
import api from './mixins/api';

import {
  isSupportTouch,
  isChildInParent,
  insertChildrenIntoSlot
} from 'shared/util';
import { smallChangeArray } from 'shared/constants';
import { installResizeDetection } from 'core/third-party/resize-detector/index';

import { createBar } from 'mode/shared/bar';

const withBase = (createPanel, opts, Vue) => {
  return Vue.component(opts.name || 'vueScroll', {
    components: opts.components,
    props: {
      ops: { type: Object }
    },
    mixins: [
      /** Hack lifecycle to merge options*/
      hackLifecycle,
      api
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

    render(h) {
      let vm = this;
      if (vm.renderError) {
        return <div>{[vm.$slots['default']]}</div>;
      }

      // vuescroll data
      const data = {
        style: {
          height: vm.vuescroll.state.height,
          width: vm.vuescroll.state.width,
          padding: 0
        },
        class: '__vuescroll'
      };

      if (!isSupportTouch()) {
        data.on = {
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
        data.on = {
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

      const ch = [
        createPanel(h, vm),
        createBar(h, vm, 'vertical'),
        createBar(h, vm, 'horizontal')
      ];

      const _customContainer = this.$slots['scroll-container'];
      if (_customContainer) {
        return insertChildrenIntoSlot(h, _customContainer, ch, data);
      }

      return <div {...data}>{ch}</div>;
    },
    mounted() {
      if (!this.renderError) {
        this.initVariables();
        this.initWatchOpsChange();
        this.refreshInternalStatus();
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
      }
    },

    /** ------------------------------- Methods -------------------------------- */
    methods: {
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

      /** ------------------------ Registry Resize --------------------------- */

      registryParentResize() {
        const resizeEnable = this.mergedOptions.vuescroll.detectResize;
        this.destroyParentDomResize = resizeEnable
          ? installResizeDetection(this.$el.parentNode, this.useNumbericSize)
          : () => {};
      }
    }
  });
};

export default withBase;
