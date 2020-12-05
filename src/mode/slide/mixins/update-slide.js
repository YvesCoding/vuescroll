/**
 * These mixes is exclusive for slide mode
 */

import Scroller from 'core/third-party/scroller/index';
import { render } from 'core/third-party/scroller/render';
import { listenContainer } from 'core/third-party/scroller/listener';
import { __REFRESH_DOM_NAME, __LOAD_DOM_NAME } from 'shared/constants';
import { createSlideModeStyle } from 'shared/util';

createSlideModeStyle();
/**
 * @description refresh and load callback
 */
function createStateCallbacks(type, stageType, vm, tipDom) {
  const listeners = vm.$listeners;

  const activateCallback = () => {
    vm.vuescroll.state[stageType] = 'active';
    vm.$emit(type + '-activate', vm, tipDom);
  };

  const deactivateCallback = () => {
    vm.vuescroll.state[stageType] = 'deactive';
    vm.$emit(type + '-deactivate', vm, tipDom);
  };

  const beforeDeactiveEnd = () => {
    vm.vuescroll.state[stageType] = 'beforeDeactiveEnd';
    vm.$emit(type + '-before-deactivate-end', vm, tipDom);
  };

  let startCallback = () => {
    vm.vuescroll.state[stageType] = 'start';
    setTimeout(() => {
      vm.scroller.finishRefreshOrLoad();
    }, 2000); // Default start stage duration
  };

  // let beforeDeactivateCallback = done => {
  //   vm.vuescroll.state[stageType] = 'beforeDeactive';
  //   setTimeout(function() {
  //     done();
  //   }, 500); // Default before-deactivated stage duration
  // };
  let beforeDeactivateCallback;

  /* istanbul ignore if */
  if (listeners[type + '-before-deactivate']) {
    beforeDeactivateCallback = (done) => {
      vm.vuescroll.state[stageType] = 'beforeDeactive';
      vm.$emit(type + '-before-deactivate', vm, tipDom, done.bind(vm.scroller));
    };
  }

  /* istanbul ignore if */
  if (listeners[type + '-start']) {
    startCallback = () => {
      vm.vuescroll.state[stageType] = 'start';
      vm.$emit(
        type + '-start',
        vm,
        tipDom,
        vm.scroller.finishRefreshOrLoad.bind(vm.scroller)
      );
    };
  }

  return {
    activateCallback,
    deactivateCallback,
    startCallback,
    beforeDeactivateCallback,
    beforeDeactiveEnd
  };
}

export default {
  mounted() {
    this.vsMounted = true;
  },
  computed: {
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
    refrehDomVisiable() {
      return this.vsMounted && this.outTheTopBoundary;
    },
    loadDomVisiable() {
      return this.vsMounted && this.outTheBottomBoundary;
    }
  },
  data() {
    return {
      vuescroll: {
        state: {
          /** Default tips of refresh and load */
          refreshStage: 'deactive',
          loadStage: 'deactive'
        }
      },
      vsMounted: false,
      outTheTopBoundary: false,
      outTheBottomBoundary: false
    };
  },
  methods: {
    // Update:
    // 1. update height/width
    // 2. update refresh or load
    updateScroller() {
      this.updateDimesion();
      this.registryRefreshLoad();
    },
    updateDimesion() {
      const clientWidth = this.$el.clientWidth;
      const clientHeight = this.$el.clientHeight;
      let contentWidth = this.scrollPanelElm.scrollWidth;
      let contentHeight = this.scrollPanelElm.scrollHeight;
      let refreshHeight = 0;
      let loadHeight = 0;
      // If the refresh option is true,let's  give a "margin-top" style to
      // the refresh-tip dom. let it to be invisible when doesn't trigger
      // refresh.
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        if (this.vsMounted) {
          const refreshDom =
            this.$refs[__REFRESH_DOM_NAME].elm ||
            this.$refs[__REFRESH_DOM_NAME];
          refreshHeight = refreshDom.offsetHeight;
          refreshDom.style.marginTop = -refreshHeight + 'px';
        }
      }
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        if (this.vsMounted) {
          const loadDom =
            this.$refs[__LOAD_DOM_NAME].elm || this.$refs[__LOAD_DOM_NAME];
          loadHeight = loadDom.offsetHeight;
          contentHeight -= loadHeight;
          loadDom.style.bottom = `-${loadHeight}px`;
        }
      }
      if (this.scroller) {
        this.scroller.setDimensions(
          clientWidth,
          clientHeight,
          contentWidth,
          contentHeight,
          false
        );
      }
    },
    registryRefreshLoad() {
      // registry refresh
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        this.registryEvent('refresh');
      }
      // registry load
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        this.registryEvent('load');
      }
    },
    registryScroller({ left = 0, top = 0, zoom = 1 } = {}) {
      const {
        preventDefault,
        preventDefaultOnMove
      } = this.mergedOptions.vuescroll.scroller;
      let {
        paging,
        snapping: { enable: snapping },
        renderMethod,
        zooming,
        locking
      } = this.mergedOptions.vuescroll;
      // disale zooming when refresh or load enabled
      zooming = !this.refreshLoad && !paging && !snapping && zooming;
      const { scrollingY, scrollingX } = this.mergedOptions.scrollPanel;

      const scrollingComplete = this.scrollingComplete.bind(this);

      // Initialize Scroller
      this.scroller = new Scroller(
        render(this.scrollPanelElm, window, 'px', renderMethod),
        {
          ...this.mergedOptions.vuescroll.scroller,
          zooming,
          scrollingY,
          scrollingX: scrollingX && !this.refreshLoad,
          animationDuration: this.mergedOptions.scrollPanel.speed,
          paging,
          snapping,
          scrollingComplete,
          locking
        }
      );

      this.scroller.__disable = this.mergedOptions.vuescroll.scroller.disable;
      this.scroller.__scrollLeft = left;
      this.scroller.__scrollTop = top;
      this.scroller.__zoomLevel = zoom;

      // Set snap
      if (snapping) {
        this.scroller.setSnapSize(
          this.mergedOptions.vuescroll.snapping.width,
          this.mergedOptions.vuescroll.snapping.height
        );
      }
      var rect = this.$el.getBoundingClientRect();
      this.scroller.setPosition(
        rect.left + this.$el.clientLeft,
        rect.top + this.$el.clientTop
      );

      // Get destroy callback
      const cb = listenContainer(
        this.$el,
        this.scroller,
        (eventType) => {
          // Thie is to dispatch the event from the scroller.
          // to let vuescroll refresh the dom
          switch (eventType) {
          case 'mousedown':
            this.vuescroll.state.isDragging = true;
            break;
          case 'onscroll':
            {
              /**
                 * Trigger auto load
                 */
              const stage = this.vuescroll.state['loadStage'];
              const {
                enable,
                auto,
                autoLoadDistance
              } = this.mergedOptions.vuescroll.pushLoad;
              const { __scrollTop, __maxScrollTop } = this.scroller;
              if (
                stage != 'start' &&
                  enable &&
                  auto &&
                  !this.lockAutoLoad && // auto load debounce
                  autoLoadDistance >= __maxScrollTop - __scrollTop &&
                  __scrollTop > 0
              ) {
                this.lockAutoLoad = true;
                this.triggerRefreshOrLoad('load');
              }

              if (autoLoadDistance < __maxScrollTop - __scrollTop) {
                this.lockAutoLoad = false;
              }

              this.handleScroll(false);
            }

            break;
          case 'mouseup':
            this.vuescroll.state.isDragging = false;
            break;
          }
        },
        zooming,
        preventDefault,
        preventDefaultOnMove
      );

      this.updateScroller();

      return cb;
    },
    updateSlideModeBarState() {
      // update slide mode scrollbars' state
      let heightPercentage, widthPercentage;
      const vuescroll = this.$el;
      const scroller = this.scroller;

      let outerLeft = 0;
      let outerTop = 0;

      const { clientWidth, clientHeight } = this.$el;

      const contentWidth = clientWidth + this.scroller.__maxScrollLeft;
      const contentHeight = clientHeight + this.scroller.__maxScrollTop;

      // We should add the the height or width that is
      // out of horizontal bountry  to the total length

      /* istanbul ignore if */
      if (scroller.__scrollLeft < 0) {
        outerLeft = -scroller.__scrollLeft;
      } /* istanbul ignore next */ else if (
        scroller.__scrollLeft > scroller.__maxScrollLeft
      ) {
        outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
      }

      // out of vertical bountry
      if (scroller.__scrollTop < 0) {
        outerTop = -scroller.__scrollTop;
        this.outTheBottomBoundary = false;
        this.outTheTopBoundary = true;
      } else if (scroller.__scrollTop > scroller.__maxScrollTop) {
        outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
        this.outTheTopBoundary = false;
        this.outTheBottomBoundary = true;
      } else {
        this.outTheTopBoundary = this.outTheBottomBoundary = false;
      }

      heightPercentage = clientHeight / (contentHeight + outerTop);
      widthPercentage = clientWidth / (contentWidth + outerLeft);

      const scrollTop = Math.min(
        Math.max(0, scroller.__scrollTop),
        scroller.__maxScrollTop
      );
      const scrollLeft = Math.min(
        Math.max(0, scroller.__scrollLeft),
        scroller.__maxScrollLeft
      );

      this.bar.vBar.state.posValue =
        ((scrollTop + outerTop) * 100) / vuescroll.clientHeight;
      this.bar.hBar.state.posValue =
        ((scrollLeft + outerLeft) * 100) / vuescroll.clientWidth;

      /* istanbul ignore if */
      if (scroller.__scrollLeft < 0) {
        this.bar.hBar.state.posValue = 0;
      }
      if (scroller.__scrollTop < 0) {
        this.bar.vBar.state.posValue = 0;
      }

      this.bar.vBar.state.size = heightPercentage < 1 ? heightPercentage : 0;
      this.bar.hBar.state.size = widthPercentage < 1 ? widthPercentage : 0;
    },
    registryEvent(type) {
      const domName = type == 'refresh' ? __REFRESH_DOM_NAME : __LOAD_DOM_NAME;
      const activateFunc =
        type == 'refresh'
          ? this.scroller.activatePullToRefresh
          : this.scroller.activatePushToLoad;
      const stageType = type == 'refresh' ? 'refreshStage' : 'loadStage';
      const tipDom = this.$refs[domName].elm || this.$refs[domName];
      const cbs = createStateCallbacks(type, stageType, this, tipDom);
      const height = tipDom.offsetHeight;

      activateFunc.bind(this.scroller)(height, cbs);
    },
    getSlidePosition() {
      return {
        scrollLeft: this.scroller.__scrollLeft,
        scrollTop: this.scroller.__scrollTop
      };
    }
  }
};
