// import scroller
import Scroller from "../../util/scroller";
import {
  render 
} from "../../util/scroller/render";
import {
  listenContainer
}from "../../util/scroller/listener";

/**
 * @description refresh callback
 */
let refreshActivateCallback = function() {
  this.vuescroll.state.refreshStage = "active";
};

let refreshStartCallback = function() {
  const vm = this;
  vm.vuescroll.state.refreshStage = "start";
  setTimeout(function() {
    vm.scroller.finishRefreshOrLoad();
  }, 2000);
};

let refreshBeforeDeactivateCallback = function(done) {
  const vm = this;
  vm.vuescroll.state.refreshStage = "beforeDeactive";
  setTimeout(function() {
    done();
  }, 500);
};

let refreshDeactivateCallback = function() {
  this.vuescroll.state.refreshStage = "deactive";
};


/**
 * @description load callback
 */
let loadActivateCallback = function() {
  this.vuescroll.state.loadStage = "active";
};

let loadStartCallback = function() {
  const vm = this;
  vm.vuescroll.state.loadStage = "start";
  setTimeout(function() {
    vm.scroller.finishRefreshOrLoad();
  }, 2000);
};

let loadBeforeDeactivateCallback = function(done) {
  const vm = this;
  vm.vuescroll.state.loadStage = "beforeDeactive";
  setTimeout(function() {
    done();
  }, 500);
};

let loadDeactivateCallback = function() {
  this.vuescroll.state.loadStage = "deactive";
};



export default {
  methods: {
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
      if(this.mergedOptions.vuescroll.pullRefresh.enable) {
        const refreshDom = this.$refs["refreshDom"].elm || this.$refs["refreshDom"];
        refreshHeight = refreshDom.scrollHeight;
        if(!refreshDom.style.marginTop) {
          refreshDom.style.marginTop = -refreshHeight + "px";
          contentHeight -= refreshHeight; 
        }
      }
      if(this.mergedOptions.vuescroll.pushLoad.enable) {
        const loadDom = this.$refs["loadDom"].elm || this.$refs["loadDom"];
        loadHeight = loadDom.scrollHeight;
        //  hide the trailing load dom..
        contentHeight -= loadHeight; 
      }
      this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
    },
    registryScroller() {
      const paging = this.mergedOptions.vuescroll.paging;
      const snapping = this.mergedOptions.vuescroll.snapping.enable;
      // disale zooming when refresh or load enabled
      let zooming = !this.refreshLoad && !paging && !snapping && this.mergedOptions.vuescroll.zooming;
      const {scrollingY, scrollingX} = this.mergedOptions.scrollPanel;
      // Initialize Scroller
      this.scroller = new Scroller(render(this.scrollPanelElm, window), {
        zooming,
        scrollingY,
        scrollingX: scrollingX && !this.refreshLoad,
        animationDuration: this.mergedOptions.scrollPanel.speed,
        paging,
        snapping
      });
      // if snapping enabled
      // we should set snap size
      if(snapping) {
        this.scroller.setSnapSize(
          this.mergedOptions.vuescroll.snapping.width,
          this.mergedOptions.vuescroll.snapping.height
        );
      }
      var rect = this.$el.getBoundingClientRect();
      this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop);    
      const cb = listenContainer(this.$el, this.scroller, (eventType) => {
        // Thie is to dispatch the event from the scroller.
        // to let vuescroll refresh the dom
        switch(eventType) {
        case "mousedown":
          this.vuescroll.state.isDragging = true;
          break;
        case "onscroll":
          this.handleScroll(false);
          break;
        case "mouseup":
          this.vuescroll.state.isDragging = false;
          break;
        }
      }, zooming);
      // registry refresh
      if(this.mergedOptions.vuescroll.pullRefresh.enable) {
        const refreshDom = this.$refs["refreshDom"].elm || this.$refs["refreshDom"];
        if(this.$listeners["refresh-activate"]) {
          refreshActivateCallback = () => {
            this.vuescroll.state.refreshStage = "active";
            this.$emit("refresh-activate", this, refreshDom);
          };
        }
        if(this.$listeners["refresh-before-deactivate"]) {
          refreshBeforeDeactivateCallback = (done) => {
            this.vuescroll.state.refreshStage = "beforeDeactive";
            this.$emit("refresh-before-deactivate", this, refreshDom, done.bind(this.scroller));
          };
        }
        if(this.$listeners["refresh-deactivate"]) {
          refreshDeactivateCallback = () => {
            this.vuescroll.state.refreshStage = "deactive";
            this.$emit("refresh-deactivate", this, refreshDom);
          };
        }
        if(this.$listeners["refresh-start"]) {
          refreshStartCallback = () => {
            this.vuescroll.state.refreshStage = "start";
            this.$emit("refresh-start", this, refreshDom, this.scroller.finishRefreshOrLoad.bind(this.scroller));
          };
        }
        const refreshHeight = refreshDom.scrollHeight;
        this.scroller.activatePullToRefresh(
          refreshHeight,
          refreshActivateCallback.bind(this),
          refreshDeactivateCallback.bind(this),
          refreshStartCallback.bind(this),
          refreshBeforeDeactivateCallback.bind(this)
        );
      }
      // registry load
      if(this.mergedOptions.vuescroll.pushLoad.enable) {
        const loadDom = this.$refs["loadDom"].elm || this.$refs["loadDom"];
        if(this.$listeners["load-activate"]) {
          loadActivateCallback = () => {
            this.vuescroll.state.loadStage = "active";
            this.$emit("load-activate", this, loadDom);
          };
        }
        if(this.$listeners["load-before-deactivate"]) {
          loadBeforeDeactivateCallback = (done) => {
            this.vuescroll.state.loadStage = "beforeDeactive";
            this.$emit("load-before-deactivate", this, loadDom, done.bind(this.scroller));
          };
        }
        if(this.$listeners["load-deactivate"]) {
          loadDeactivateCallback = () => {
            this.vuescroll.state.loadStage = "deactive";
            this.$emit("load-deactivate", this, loadDom);
          };
        }
        if(this.$listeners["load-start"]) {
          loadStartCallback = () => {
            this.vuescroll.state.loadStage = "start";
            this.$emit("load-start", this, loadDom, this.scroller.finishRefreshOrLoad.bind(this.scroller));
          };
        }
                
        let loadHeight = loadDom.scrollHeight;
        this.scroller.activatePushToLoad(
          loadHeight,
          loadActivateCallback.bind(this),
          loadDeactivateCallback.bind(this),
          loadStartCallback.bind(this),
          loadBeforeDeactivateCallback.bind(this)
        );
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
      const __enableScrollX = (clientWidth < contentWidth) && this.mergedOptions.scrollPanel.scrollingX;
      const __enableScrollY = (clientHeight < contentHeight) && this.mergedOptions.scrollPanel.scrollingY;
      // out of horizontal bountry 
      if(__enableScrollX) {
        if(scroller.__scrollLeft < 0) {
          outerLeft = -scroller.__scrollLeft;
        } else if(scroller.__scrollLeft > scroller.__maxScrollLeft) {
          outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
        }
      }
      // out of vertical bountry
      if(__enableScrollY) {
        if(scroller.__scrollTop < 0) {
          outerTop = -scroller.__scrollTop;
        } else if(scroller.__scrollTop > scroller.__maxScrollTop) {
          outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
        }
      } 
      heightPercentage = (clientHeight * 100 / (contentHeight + outerTop));
      widthPercentage = (clientWidth * 100 / (contentWidth + outerLeft));
      const scrollTop = Math.min(Math.max(0, scroller.__scrollTop), scroller.__maxScrollTop);
      const scrollLeft = Math.min(Math.max(0, scroller.__scrollLeft), scroller.__maxScrollLeft);
      this.bar.vBar.state.posValue =  (((scrollTop + outerTop) * 100) / vuescroll.clientHeight);
      this.bar.hBar.state.posValue =  (((scrollLeft + outerLeft) * 100) / vuescroll.clientWidth);    
      if(scroller.__scrollLeft < 0) {
        this.bar.hBar.state.posValue = 0;
      }
      if(scroller.__scrollTop < 0) {
        this.bar.vBar.state.posValue = 0;
      }
      this.bar.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + "%") : 0;
      this.bar.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + "%") : 0;
    }
  }
};