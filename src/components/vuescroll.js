import { listenResize } from "../third-party/resize-detector";
import hackLifecycle from "../mixins/hack-lifecycle";
import api from "../mixins/api";
import nativeMode from "../mixins/mode/native-mode";
import slideMode from "../mixins/mode/slide-mode";

import bar, { createBar } from "./child-components/vuescroll-bar";
import rail, { createRail } from "./child-components/vuescroll-rail";
import scrollContent from "./child-components/vueScroll-content";
import scrollPanel, { createPanel } from "./child-components/vueScroll-panel";

import { uncessaryChangeArray } from "../shared/constants";

function findValuesByMode(mode, vm) {
  let axis = {};
  switch(mode) {
  case "native":
  case "pure-native": axis = {x: vm.scrollPanelElm.scrollLeft, y: vm.scrollPanelElm.scrollTop}; break;
  case "slide": axis = {x: vm.scroller.__scrollLeft, y: vm.scroller.__scrollTop}; break;
  }
  return axis;
}

export default  {
  name: "vueScroll",
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
          refreshStage : "deactive",
          loadStage: "deactive"
        }
      },
      scrollPanel: { },
      scrollContent: { },
      rail: {
        vRail: {
          state: { }
        },
        hRail: {
          state: { }
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
    if(vm.renderError) {
      return (
        [vm.$slots["default"]]
      );
    }
    // vuescroll data
    const vuescrollData = {
      style: {
        position: "relative",
        height: "100%",
        width: "100%",
        padding: 0,
        overflow: "hidden"
      },
      class: "vue-scroll",
      on: {
        mouseenter() {
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
        },
        mouseleave() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        mousemove()/* istanbul ignore next */{
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
        }
      }
    };
    return (
      <div {...vuescrollData}>
        {createPanel(h, vm)}
        {createRail(h, vm, "vertical")}
        {createBar(h, vm, "vertical")}
        {createRail(h, vm, "horizontal")}
        {createBar(h, vm, "horizontal")}
      </div>
    );
  },
  computed: {
    scrollPanelElm() {
      return this.$refs.scrollPanel.$el;
    },
    scrollContentElm() {
      return this.$refs["scrollContent"]._isVue ?  this.$refs["scrollContent"].$el : this.$refs["scrollContent"];
    },
    mode() {
      return this.mergedOptions.vuescroll.mode;
    },
    pullRefreshTip() {
      return this.mergedOptions.vuescroll.pullRefresh.tips[this.vuescroll.state.refreshStage];
    },
    pushLoadTip() {
      return this.mergedOptions.vuescroll.pushLoad.tips[this.vuescroll.state.loadStage];
    },
    refreshLoad() {
      return this.mergedOptions.vuescroll.pullRefresh.enable || this.mergedOptions.vuescroll.pushLoad.enable;
    }
  },
  methods: {
    update(eventType, nativeEvent = null) {
      if(this.mode == "native" || this.mode == "pure-native") {
        this.updateNativeModeBarState();   
      }
      else  if(this.mode == "slide") {
        this.updateSlideModeBarState();
      }       
      if(eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
    },
    updateMode() {
      if(this.shouldStop) {
        this.$nextTick(() => {
          this.shouldStop = false;
        });
        return;
      }
      const x = this.vuescroll.state.internalScrollLeft;
      const y = this.vuescroll.state.internalScrollTop;
      if(this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      if(this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      } else if(this.mode == "native" || this.mode == "pure-native") {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = "";
        this.scrollPanelElm.style.transformOrigin = "";
      }
      // keep the last-mode's position.
      this.scrollTo({ x, y }, false, true /* force */);
    },
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.update("handle-scroll", nativeEvent);
      this.showAndDefferedHideBar();
    },
    setBarClick(val) {
      this.vuescroll.state.isClickingBar = val;
    },
    showAndDefferedHideBar() {
      this.showBar();
      if(this.vuescroll.state.timeoutId) {
        clearTimeout(this.vuescroll.state.timeoutId); //eslint-disable-line
      }
      this.vuescroll.state.timeoutId = setTimeout(() => { //eslint-disable-line
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
          type: "vertical"
        }, horizontal = {
          type: "horizontal"
        };
      if(this.mode == "slide") {
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
        clientHeight = this.$el.clientHeight;
        clientWidth = this.$el.clientWidth;
      }
      vertical["process"] = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
      horizontal["process"] =Math.min(scrollLeft / (scrollWidth - clientWidth), 1);
      vertical["barSize"] = this.bar.vBar.state.size;
      horizontal["barSize"] = this.bar.hBar.state.size;
      vertical["scrollTop"] = scrollTop;
      horizontal["scrollLeft"] = scrollLeft;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    showBar() {
      this.bar.vBar.state.opacity =  this.mergedOptions.bar.vBar.opacity;
      this.bar.hBar.state.opacity =  this.mergedOptions.bar.hBar.opacity;
    },
    hideBar() {
      // when in non-native mode dragging content
      // in slide mode, just return
      if(this.vuescroll.state.isDragging) {
        return;
      }
      // add isClickingBar condition 
      // to prevent from hiding bar while dragging the bar 
      if(!this.mergedOptions.bar.vBar.keepShow && !this.vuescroll.state.isClickingBar && this.vuescroll.state.pointerLeave) {
        this.bar.vBar.state.opacity = 0;
      }
      if(!this.mergedOptions.bar.hBar.keepShow && !this.vuescroll.state.isClickingBar && this.vuescroll.state.pointerLeave) {
        this.bar.hBar.state.opacity = 0;
      }
    },
    registryResize() {
      if(this.shouldStop) {
        this.$nextTick(() => {
          this.shouldStop = false;
        });
        return;
      }
      /* istanbul ignore next */
      if(this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }
      let contentElm = null;
      if(this.mode == "slide" || this.mode == "pure-native") {
        contentElm = this.scrollPanelElm;
      } else if(this.mode == "native") {
        // scrollContent maybe a component or a pure-dom
        contentElm = this.scrollContentElm;
      }
      const handleWindowResize = () => {
        this.update();
        this.showAndDefferedHideBar();
        if(this.mode == "slide") {
          this.updateScroller();
        }
      };
      const handleDomResize = () => {
        let currentSize = {};    
        if(this.mode == "slide") {
          this.updateScroller();
          currentSize["width"] = this.scroller.__contentWidth;
          currentSize["height"] = this.scroller.__contentHeight;
        } else if(this.mode == "native") {
          currentSize["width"] = this.scrollPanelElm.scrollWidth;
          currentSize["height"] = this.scrollPanelElm.scrollHeight;
        }
        this.update("handle-resize", currentSize);
        this.showAndDefferedHideBar();
      };                
      window.addEventListener("resize", handleWindowResize, false);
      const destroyDomResize = listenResize(contentElm, handleDomResize);
      const destroyWindowResize = () => { window.removeEventListener("resize", handleWindowResize, false); };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();
      };
    },
    recordCurrentPos() {
      let mode = this.mode;
      if(this.mode !== this.lastMode) {
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
      this.$watch("mergedOptions", () => {
      // record current position
        this.recordCurrentPos();
        this.$nextTick(() => {
        // update scroll..
          this.registryResize();
          this.updateMode();
        });
      }, watchOpts);

      uncessaryChangeArray.forEach(opts => {
        this.$watch(opts, () => {
          // when small changes changed, 
          // we need not to updateMode or registryResize
          this.shouldStop = true;
        }, watchOpts);
      });
    }
  },
  mounted() {
    if(!this._isDestroyed && !this.renderError) {
      if(this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      }
      this.lastMode = this.mode;

      this.registryResize();
      this.initWatch();
      
      this.$nextTick(() => {
        // update state
        this.update();
        this.showAndDefferedHideBar();
      });
    }
  },
  updated() { 
    this.$nextTick(() => {
      if(!this._isDestroyed) {
        this.showAndDefferedHideBar();
      }
    }); 
  }
};