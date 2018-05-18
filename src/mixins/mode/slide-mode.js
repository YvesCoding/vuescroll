// import scroller
import Scroller from '../../third-party/scroller';
import { render } from '../../third-party/scroller/render';
import { listenContainer } from '../../third-party/scroller/listener';
/**
 * @description refresh and load callback
 */
function createStateCallbacks(type, stageName, vm, tipDom) {
  const listeners = vm.$listeners;

  let activateCallback = () => {
    vm.vuescroll.state[stageName] = 'active';
  };

  let deactivateCallback = () => {
    vm.vuescroll.state[stageName] = 'deactive';
  };

  let startCallback = () => {
    vm.vuescroll.state[stageName] = 'start';
    setTimeout(() => {
      vm.scroller.finishRefreshOrLoad();
    }, 2000);
  };

  let beforeDeactivateCallback = done => {
    vm.vuescroll.state[stageName] = 'beforeDeactive';
    setTimeout(function() {
      done();
    }, 500);
  };
  /* istanbul ignore if */
  if (listeners[type + '-activate']) {
    activateCallback = () => {
      vm.vuescroll.state[stageName] = 'active';
      vm.$emit(type + '-activate', vm, tipDom);
    };
  }
  /* istanbul ignore if */
  if (listeners[type + '-before-deactivate']) {
    beforeDeactivateCallback = done => {
      vm.vuescroll.state[stageName] = 'beforeDeactive';
      vm.$emit(type + '-before-deactivate', vm, tipDom, done.bind(vm.scroller));
    };
  }
  /* istanbul ignore if */
  if (listeners[type + '-deactivate']) {
    deactivateCallback = () => {
      vm.vuescroll.state[stageName] = 'deactive';
      vm.$emit(type + '-deactivate', vm, tipDom);
    };
  }
  /* istanbul ignore if */
  if (listeners[type + '-start']) {
    startCallback = () => {
      vm.vuescroll.state[stageName] = 'start';
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
    beforeDeactivateCallback
  };
}

export default {
  methods: {
    // update scrollbar's size and pos  while in slide mode.
    updateScroller() {
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
        const refreshDom =
          this.$refs['refreshDom'].elm || this.$refs['refreshDom'];
        refreshHeight = refreshDom.offsetHeight;
        if (!refreshDom.style.marginTop) {
          refreshDom.style.marginTop = -refreshHeight + 'px';
          contentHeight -= refreshHeight;
        }
      }
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        const loadDom = this.$refs['loadDom'].elm || this.$refs['loadDom'];
        loadHeight = loadDom.offsetHeight;
        //  hide the trailing load dom..
        contentHeight -= loadHeight;
      }
      this.scroller.setDimensions(
        clientWidth,
        clientHeight,
        contentWidth,
        contentHeight
      );
    },
    registryScroller() {
      const preventDefault = this.mergedOptions.vuescroll.scroller
        .preventDefault;
      const paging = this.mergedOptions.vuescroll.paging;
      const snapping = this.mergedOptions.vuescroll.snapping.enable;
      // disale zooming when refresh or load enabled
      let zooming =
        !this.refreshLoad &&
        !paging &&
        !snapping &&
        this.mergedOptions.vuescroll.zooming;
      const { scrollingY, scrollingX } = this.mergedOptions.scrollPanel;
      // hadnle for scroll complete
      const scrollingComplete = () => {
        this.updateBarStateAndEmitEvent('handle-scroll-complete');
      };
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
      // if snapping enabled
      // we should set snap size
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
        preventDefault
      );
      // registry refresh
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        this.registryEvent('refresh');
      }
      // registry load
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        this.registryEvent('load');
      }
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
      const clientWidth = vuescroll.clientWidth;
      const clientHeight = vuescroll.clientHeight;
      const contentWidth = clientWidth + this.scroller.__maxScrollLeft;
      const contentHeight = clientHeight + this.scroller.__maxScrollTop;
      const __enableScrollX =
        clientWidth < contentWidth && this.mergedOptions.scrollPanel.scrollingX;
      const __enableScrollY =
        clientHeight < contentHeight &&
        this.mergedOptions.scrollPanel.scrollingY;
      // out of horizontal bountry
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
      heightPercentage = clientHeight * 100 / (contentHeight + outerTop);
      widthPercentage = clientWidth * 100 / (contentWidth + outerLeft);
      const scrollTop = Math.min(
        Math.max(0, scroller.__scrollTop),
        scroller.__maxScrollTop
      );
      const scrollLeft = Math.min(
        Math.max(0, scroller.__scrollLeft),
        scroller.__maxScrollLeft
      );
      this.bar.vBar.state.posValue =
        (scrollTop + outerTop) * 100 / vuescroll.clientHeight;
      this.bar.hBar.state.posValue =
        (scrollLeft + outerLeft) * 100 / vuescroll.clientWidth;
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
      const domName = type == 'refresh' ? 'refreshDom' : 'loadDom';
      const activateFunc =
        type == 'refresh'
          ? this.scroller.activatePullToRefresh
          : this.scroller.activatePushToLoad;
      const stageName = type == 'refresh' ? 'refreshStage' : 'loadStage';
      const tipDom = this.$refs[domName].elm || this.$refs[domName];
      const cbs = createStateCallbacks(type, stageName, this, tipDom);
      const height = tipDom.offsetHeight;
      activateFunc.bind(this.scroller)(height, cbs);
    }
  }
};
