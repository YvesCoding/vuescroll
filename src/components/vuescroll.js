// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
  listenResize
} from "../util";

// import mix begin.....
// import lefrCycle
import hackLifecycle from "../mixins/hack-lifecycle";
// import api
import api from "../mixins/api";
// import native mode
import nativeMode from "../mixins/mode/native-mode";
// import slide mode
import slideMode from "../mixins/mode/slide-mode";
// import mix end......

// import child components
import bar, {createBar} from "./child-components/vuescroll-bar";
import rail, {createRail} from "./child-components/vuescroll-rail";
import scrollContent from "./child-components/vueScroll-content";
import scrollPanel, {createPanel} from "./child-components/vueScroll-panel";

export default  {
  name: "vueScroll",
  mixins: [hackLifecycle, 
    api, 
    nativeMode, 
    slideMode],
  data() {
    return {
      // vuescroll components' state
      vuescroll: {
        state: {
          isDragging: false,
          // vuescroll internal states
          listeners: [],
          // judge whether the mouse pointer keeps pressing
          // the scrollbar or not, if true, we don't hide the 
          // scrollbar when mouse leave the vuescroll.
          isClickingBar: false,
          pointerLeave: true,
          timeoutId: 0,
          // for  recording the current states of
          // scrollTop and scrollHeight when switching the
          // mode
          internalScrollTop: 0,
          internalScrollLeft: 0,
          // refresh internal state..
          // handle for refresh state
          refreshStage : "deactive",
          loadStage: "deactive"
        }
      },
      scrollPanel: {
        el: "",
        state: {
          left: 0,
          top: 0,
          zoom: 1
        }
      },
      scrollContent: {
      },
      rail: {
        vRail: {
          state: {
  
          }
        },
        hRail: {
          state: {
  
          }
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
      }
      ,
      mergedOptions: {
        vuescroll: {
        },
        scrollPanel: {
        },
        scrollContent: {
        },
        rail: {
        },
        bar: {
        }
      }
    };
  },
  render(h) {
    let vm = this;

    if(vm.shouldStopRender) {
      return (
        <div>
          {[vm.$slots["default"]]}
        </div>
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
    // update function 
    // update different modes of states of scrollbar
    update(eventType, nativeEvent = null) {
      if(this.mode == "native") {
        this.updateNativeModeBarState();   
      }
      // else branch handle for other mode 
      else  if(this.mode == "slide") {
        this.updateSlideModeBarState();
      }       
      // emit event
      if(eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
    },
    // when mode changes,
    // update it
    updateMode() {
      if(this.uncessaryChanges) {
        this.$nextTick(() => {
          this.uncessaryChanges = false;
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
      } else if(this.mode == "native") {
        // remove the transform style attribute
        this.scrollPanelElm.style.transform = "";
        this.scrollPanelElm.style.transformOrigin = "";
      }
      this.scrollTo({
        x,
        y
      }, false);
    },
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.update("handle-scroll", nativeEvent);
      this.showAndDefferedHideBar();
    },
    setBarClick(val) {
      this.isClickingBar = val;
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
    emitEvent(eventType, nativeEvent = null) {
      const scrollPanel = this.scrollPanelElm;
      let vertical = {
          type: "vertical"
        }, horizontal = {
          type: "horizontal"
        };
      let scrollTop = scrollPanel.scrollTop;
      let scrollLeft = scrollPanel.scrollLeft;
      if(this.mode == "slide") {
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
      }
      vertical["process"] = scrollTop / (scrollPanel.scrollHeight - scrollPanel.clientHeight);
      horizontal["process"] = scrollLeft / (scrollPanel.scrollWidth - scrollPanel.clientWidth);
      vertical["barSize"] = this.bar.vBar.state.size;
      horizontal["barSize"] = this.bar.hBar.state.size;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    showBar() {
      this.bar.vBar.state.opacity =  this.mergedOptions.bar.vBar.opacity;
      this.bar.hBar.state.opacity =  this.mergedOptions.bar.hBar.opacity;
    },
    hideBar() {
      // when in non-native mode dragging
      // just return
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
      if(this.uncessaryChanges) {
        this.$nextTick(() => {
          this.uncessaryChanges = false;
        });
        return;
      }
      /* istanbul ignore next */
      {
        if(this.destroyResize) {
          // when toggling the mode
          // we should clean the flag  object.
          this.destroyResize();
        }
        let contentElm = null;
        if(this.mode == "slide") {

          contentElm = this.scrollPanelElm;

        } else if(this.mode == "native") {
          // because we can customize the tag
          // of the scrollContent, so, scrollContent
          // maybe a dom or a component
          if(this.$refs["scrollContent"]._isVue) {
            contentElm = this.$refs["scrollContent"].$el;
          }else {
            contentElm = this.$refs["scrollContent"];
          }
        }                
        window.addEventListener("resize", () => { //eslint-disable-line
          this.update();
          this.showAndDefferedHideBar();
          if(this.mode == "slide") {
            this.updateScroller();
          }
        }, false);
        let funcArr = [
          () => {
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
          }
        ];
        // registry resize event
        // because scrollContent is a functional component
        // so it maybe a component or a dom element
        this.destroyResize = listenResize(
          contentElm
          ,
          funcArr
        );
      }
    },
    recordCurrentPos() {
      let reverse = false;
      if(this.mode !== this.lastMode) {
        reverse = true;
        this.lastMode = this.mode;
      }
      // record the scrollLeft and scrollTop
      // by judging the last mode
      if(this.mode == "native") {
        this.vuescroll.state.internalScrollLeft = reverse?this.scroller.__scrollLeft:this.scrollPanelElm.scrollLeft;
        this.vuescroll.state.internalScrollTop = reverse?this.scroller.__scrollTop:this.scrollPanelElm.scrollTop;
      }else if(this.mode == "slide"){
        this.vuescroll.state.internalScrollLeft = reverse?this.scrollPanelElm.scrollLeft:this.scroller.__scrollLeft;
        this.vuescroll.state.internalScrollTop = reverse?this.scrollPanelElm.scrollTop:this.scroller.__scrollTop;
      }
    },
    // breaking changes should registry scrollor or native 
    // again
    watchBreakingChanges() {
      // react to vuescroll's change.
      this.$watch("mergedOptions", () => {
        // record current position
        this.recordCurrentPos();
        this.$nextTick(() => {
          // update scroll..
          this.registryResize();
          this.updateMode();
        });
      }, {
        deep: true,
        sync: true
      });
    },
    // when small changes , we don't need to
    // registry the scrollor 
    watchUncessaryChanges() {
      // some uncessary changes.
      [
        "mergedOptions.vuescroll.pullRefresh.tips",
        "mergedOptions.vuescroll.pushLoad.tips",
        "mergedOptions.rail",
        "mergedOptions.bar"
      ].forEach((opts) => {
        this.$watch(opts, () => {
        // record current position
        // reverse: true
          this.uncessaryChanges = true;
        }, {
          sync: true,
          deep: true
        });
      });
    }
  },
  mounted() {
    // do something once mounted
    if(!this._isDestroyed && !this.shouldStopRender) {
      if(this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      }
      // trace the mode
      this.lastMode = this.mode;
      // registry resize event
      this.registryResize();
      this.watchBreakingChanges();
      this.watchUncessaryChanges();
      // update state
      this.update();
      this.showAndDefferedHideBar();
    }
  },
  updated() { 
    this.$nextTick(() => {
      if(!this._isDestroyed) {
        this.update();
        this.showAndDefferedHideBar();
      }
    }); 
  },
  components: {
    bar,
    rail,
    scrollContent,
    scrollPanel
  },
  props: {
    ops: { type: Object }
  }
};