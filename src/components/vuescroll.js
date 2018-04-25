import {
  listenResize,
  findValuesByMode
} from "../util";
import hackLifecycle from "../mixins/hack-lifecycle";
import api from "../mixins/api";
import nativeMode from "../mixins/mode/native-mode";
import slideMode from "../mixins/mode/slide-mode";

import bar, { createBar } from "./child-components/vuescroll-bar";
import rail, { createRail } from "./child-components/vuescroll-rail";
import scrollContent from "./child-components/vueScroll-content";
import scrollPanel, { createPanel } from "./child-components/vueScroll-panel";

const uncessaryChangeArray = [
  "mergedOptions.vuescroll.pullRefresh.tips",
  "mergedOptions.vuescroll.pushLoad.tips",
  "mergedOptions.rail",
  "mergedOptions.bar"
];

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
      scrollPanel: {
        state: {
          left: 0,
          top: 0,
          zoom: 1
        }
      },
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
        }
      }
      ,
      mergedOptions: {
        vuescroll: { },
        scrollPanel: { },
        scrollContent: { },
        rail: { },
        bar: { }
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
        // remove the transform style attribute
        this.scrollPanelElm.style.transform = "";
        this.scrollPanelElm.style.transformOrigin = "";
      }
      // scroll to the place after updating
      this.scrollTo({ x, y }, false, true /* force */);
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
      let {scrollTop, scrollLeft} = scrollPanel;
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
      {
        if(this.destroyResize) {
          // when toggling the mode
          // we should clean the flag  object.
          this.destroyResize();
        }
        let contentElm = null;
        if(this.mode == "slide" || this.mode == "pure-native") {
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
        this.destroyResize = listenResize(contentElm, funcArr);
      }
    },
    recordCurrentPos() {
      if(this.mode !== this.lastMode) {
        this.vuescroll.state.internalScrollLeft =  findValuesByMode(this.lastMode, this).x;
        this.vuescroll.state.internalScrollTop =  findValuesByMode(this.lastMode, this).y;  
        this.lastMode = this.mode;
      } else {
        this.vuescroll.state.internalScrollLeft =  findValuesByMode(this.mode, this).x;
        this.vuescroll.state.internalScrollTop =  findValuesByMode(this.mode, this).y; 
      }
    },
    // breaking changes should registry scrollor or native 
    watchChanges() {
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
    watchSmallChanges() {
      // some uncessary changes.
      uncessaryChangeArray.forEach((opts) => {
        this.$watch(opts, () => {
          this.shouldStop = true;
        }, {
          sync: true,
          deep: true
        });
      });
    }
  },
  mounted() {
    // do something while mounts
    if(!this._isDestroyed && !this.shouldStopRender) {
      if(this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      }
      // init the last mode.
      this.lastMode = this.mode;

      // registry resize event
      this.registryResize();
      this.watchChanges();
      this.watchSmallChanges();
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