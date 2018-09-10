/**
 * These mixes is exclusive for slide mode
 */

import Scroller from 'core/third-party/scroller/index';
import { render } from 'core/third-party/scroller/render';
import { listenContainer } from 'core/third-party/scroller/listener';
import { getAccurateSize } from 'shared/util';
import { __REFRESH_DOM_NAME, __LOAD_DOM_NAME } from 'shared/constants';

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

  let beforeDeactivateCallback = done => {
    vm.vuescroll.state[stageType] = 'beforeDeactive';
    setTimeout(function() {
      done();
    }, 500); // Default before-deactivated stage duration
  };

  /* istanbul ignore if */
  if (listeners[type + '-before-deactivate']) {
    beforeDeactivateCallback = done => {
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
  data() {
    return {
      vuescroll: {
        state: {
          /** Default tips of refresh and load */
          refreshStage: 'deactive',
          loadStage: 'deactive'
        }
      }
    };
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
    }
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
    registryScroller() {
      const {
        preventDefault,
        preventDefaultOnMove
      } = this.mergedOptions.vuescroll.scroller;
      const paging = this.mergedOptions.vuescroll.paging;
      const snapping = this.mergedOptions.vuescroll.snapping.enable;
      // disale zooming when refresh or load enabled
      let zooming =
        !this.refreshLoad &&
        !paging &&
        !snapping &&
        this.mergedOptions.vuescroll.zooming;
      const { scrollingY, scrollingX } = this.mergedOptions.scrollPanel;

      const scrollingComplete = this.scrollingComplete.bind(this);

      // Initialize Scroller
      this.scroller = new Scroller(render(this.scrollPanelElm, window, 'px'), {
        ...this.mergedOptions.vuescroll.scroller,
        zooming,
        scrollingY,
        scrollingX: scrollingX && !this.refreshLoad,
        animationDuration: this.mergedOptions.scrollPanel.speed,
        paging,
        snapping,
        scrollingComplete
      });

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
        eventType => {
          // Thie is to dispatch the event from the scroller.
          // to let vuescroll refresh the dom
          switch (eventType) {
          case 'mousedown':
            this.vuescroll.state.isDragging = true;
            break;
          case 'onscroll':
            this.handleScroll(false);
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

      const { clientWidth, clientHeight } = getAccurateSize(
        this.$el,
        true /* Use Math.round */
      );

      const contentWidth = clientWidth + this.scroller.__maxScrollLeft;
      const contentHeight = clientHeight + this.scroller.__maxScrollTop;

      const __enableScrollX =
        clientWidth < contentWidth && this.mergedOptions.scrollPanel.scrollingX;
      const __enableScrollY =
        clientHeight < contentHeight &&
        this.mergedOptions.scrollPanel.scrollingY;

      // We should take the the height or width that is
      // out of horizontal bountry  into the total length
      if (__enableScrollX) {
        /* istanbul ignore if */
        if (scroller.__scrollLeft < 0) {
          outerLeft = -scroller.__scrollLeft;
        } /* istanbul ignore next */ else if (
          scroller.__scrollLeft > scroller.__maxScrollLeft
        ) {
          outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
        }
      }
      // out of vertical bountry
      if (__enableScrollY) {
        if (scroller.__scrollTop < 0) {
          outerTop = -scroller.__scrollTop;
        } else if (scroller.__scrollTop > scroller.__maxScrollTop) {
          outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
        }
      }

      heightPercentage = (clientHeight * 100) / (contentHeight + outerTop);
      widthPercentage = (clientWidth * 100) / (contentWidth + outerLeft);

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

      this.bar.vBar.state.size =
        heightPercentage < 100 ? heightPercentage + '%' : 0;
      this.bar.hBar.state.size =
        widthPercentage < 100 ? widthPercentage + '%' : 0;
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
    }
  }
};
