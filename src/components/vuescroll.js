// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
  getGutter,
  hideSystemBar,
  listenResize,
  createRefreshDomStyle,
  createLoadDomStyle
} from "../util";

// import mix begin.....

// import lefrCycle
import LifeCycleMix from "../mixins/LifeCycleMix";
// import api
import vuescrollApi from "../mixins/vueScrollApi";
// import native mode
import nativeMode from "../mixins/mode/native-mode";
// import slide mode
import slideMode from "../mixins/mode/slide-mode";
// import mix end......

// import necessary components
import bar from "./vuescrollBar";
import rail from "./vuescrollRail";
import scrollContent from "./vueScrollContent";
import scrollPanel from "./vueScrollPanel";

/**
 * create a scrollPanel
 * 
 * @param {any} size 
 * @param {any} vm 
 * @returns 
 */
function createPanel(h, vm) {
  // scrollPanel data start
  const scrollPanelData = {
    ref: "scrollPanel",
    style: {
      position: "relative"
    },
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel,
      state: vm.scrollPanel.state
    }
  };
  // set overflow only if the in native mode
  if(vm.mode == "native") {
    // dynamic set overflow scroll
    // feat: #11
    if(vm.mergedOptions.scrollPanel.scrollingY) {
      scrollPanelData.style["overflowY"] = vm.vBar.state.size?"scroll":"inherit";
    } else {
      scrollPanelData.style["overflowY"] = vm.vBar.state.size?"hidden":"inherit";
    }
    if(vm.mergedOptions.scrollPanel.scrollinX) {
      scrollPanelData.style["overflowX"] = vm.vBar.state.size?"scroll":"inherit";
    } else  {
      scrollPanelData.style["overflowX"] = vm.vBar.state.size?"hidden":"inherit";
    }
    let gutter = getGutter();
    if(!getGutter.isUsed) {
      getGutter.isUsed = true;
    }
    if(!gutter) {
      hideSystemBar();
      scrollPanelData.style.height = "100%";
    } else {
      // hide system bar by use a negative value px
      // for panel and overflow hidden for parent elm,
      // because just hide system bar doesn't work 
      // for firefox. #10
      scrollPanelData.style.marginRight = `-${gutter}px`;
      scrollPanelData.style.marginBottom = `-${gutter}px`;
      scrollPanelData.style.height = `calc(100% + ${gutter}px)`;
    }
    // clear legency styles of slide mode...
    scrollPanelData.style.transformOrigin = "";
    scrollPanelData.style.transform = "";
  } else if(vm.mode == "slide") {
    scrollPanelData.style["transformOrigin"] = "left top 0px";
    scrollPanelData.style["userSelect"] = "none";
  }
  return (
    <scrollPanel
      {...scrollPanelData}
    >
      {
        (function(){
          if(vm.mode == "native") {

            return [createContent(h, vm)];

          } else if(vm.mode == "slide") {
                        
            let renderChildren = [vm.$slots.default];
            // handle for refresh
            if(vm.mergedOptions.vuescroll.pullRefresh.enable) {
              // just use user-defined refresh dom instead of default
              if(vm.$slots.refresh) {
                vm.$refs["refreshDom"] = vm.$slots.refresh[0];
                renderChildren.unshift(vm.$slots.refresh[0]);
              } else {
                createRefreshDomStyle();
                let refreshDom = null;
                // front or end of the process.
                if(vm.vuescroll.state.refreshStage == "deactive") {
                  refreshDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                    <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z"></path></g></g></svg>);
                }
                // refreshing
                else if(vm.vuescroll.state.refreshStage == "start") {
                  refreshDom = (<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                      <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.6s"
                        repeatCount="indefinite"/>
                    </path>
                  </svg>);
                }
                // release to refresh, active
                else if(vm.vuescroll.state.refreshStage == "active") {
                  refreshDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                    <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z"></path></g></g></svg>
                  );
                }
                // no slot refresh elm, use default
                renderChildren.unshift(
                  <div class="vuescroll-refresh" ref="refreshDom" key="refshDom">
                    {[refreshDom, vm.pullRefreshTip]}
                  </div>
                );
              }
            }
            
            // handle for load
            if(vm.mergedOptions.vuescroll.pushLoad.enable) {
              if(vm.$slots.load) {
                vm.$refs["loadDom"] = vm.$slots.load[0];
                renderChildren.push(vm.$slots.load[0]);
              } else {
                createLoadDomStyle();
                let loadDom = null;
                // front or end of the process.
                if(vm.vuescroll.state.loadStage == "deactive") {
                  loadDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                    <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z"></path></g></g></svg>
                  );
                }
                // loading
                else if(vm.vuescroll.state.loadStage == "start") {
                  loadDom = (<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                      <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.6s"
                        repeatCount="indefinite"/>
                    </path>
                  </svg>);
                }
                // release to load, active
                else if(vm.vuescroll.state.loadStage == "active") {
                  loadDom = (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                    <metadata> Svg Vector Icons : http://www.sfont.cn </metadata><g><g transform="matrix(1 0 0 -1 0 1008)"><path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z"></path></g></g></svg>);
                }
                // no slot load elm, use default
                renderChildren.push(
                  <div class="vuescroll-load" ref="loadDom" key="loadDom">
                    {[loadDom, vm.pushLoadTip]}
                  </div>
                );
              }
            }
            return renderChildren;
          }
        })()
      }
    </scrollPanel>
  );
}

/**
 * create scroll content
 * 
 * @param {any} size 
 * @param {any} vm 
 * @returns 
 */
function createContent(h, vm) {
  // scrollContent data
  const scrollContentData = {
    props: {
      ops: vm.mergedOptions.scrollContent,
    }
  };
  return (
    <scrollContent
      {...scrollContentData}
    >
      {[vm.$slots.default]}
    </scrollContent>
  );
}

/**
 * create rails
 * 
 * @param {any} size 
 * @param {any} type 
 * @param {any} vm 
 * @returns 
 */
function createRail(h, vm, type) {
  // rail data
  const railOptionType = type === "vertical"? "vRail": "hRail";
  const barOptionType = type === "vertical"? "vBar": "hBar";
  const axis = type === "vertical"? "Y": "X";

  const railData = {
    props: {
      type: type,
      ops: vm.mergedOptions[railOptionType],
      state: vm[railOptionType].state
    }
  };
  if(!vm[barOptionType].state.size 
    || 
    !vm.mergedOptions.scrollPanel["scrolling" + axis]
    || (vm.refreshLoad && type !== "vertical" && vm.mode === "slide")) {
    return null;
  }
  return (
    <rail 
      {...railData}
    />
  );

}

/**
 * create bars
 * 
 * @param {any} size 
 * @param {any} type 
 */
function createBar(h, vm, type) {
  // hBar data
  const barOptionType = type === "vertical"? "vBar": "hBar";
  const axis = type === "vertical"? "Y": "X";

  const barData = {
    props: {
      type: type,
      ops: vm.mergedOptions[barOptionType],
      state: vm[barOptionType].state
    },
    on: {
      setMousedown: vm.setMousedown
    },
    ref: `${type}Bar`
  };
  if(!vm[barOptionType].state.size 
    || !vm.mergedOptions.scrollPanel["scrolling" + axis]
    || (vm.refreshLoad && type !== "vertical" && vm.mode === "slide")) {
    return null;
  }
  return (
    <bar 
      {...barData}
    />
  );
  
}

export default  {
  name: "vueScroll",
  mixins: [LifeCycleMix, 
    vuescrollApi, 
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
          mousedown: false,
          pointerLeave: true,
          timeoutId: 0,
          updateType: "",
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
      vRail: {
        state: {

        }
      },
      hRail: {
        state: {

        }
      },
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
      mergedOptions: {
        vuescroll: {
        },
        scrollPanel: {
        },
        scrollContent: {
        },
        vRail: {
        },
        vBar: {
        },
        hRail: {
        },
        hBar: {
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
          vm.update();
        },
        mouseleave() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        mousemove()/* istanbul ignore next */{
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
          vm.update(); 
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
      vertical["barSize"] = this.vBar.state.size;
      horizontal["barSize"] = this.hBar.state.size;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    showBar() {
      this.vBar.state.opacity =  this.mergedOptions.vBar.opacity;
      this.hBar.state.opacity =  this.mergedOptions.hBar.opacity;
    },
    hideBar() {
      // when in non-native mode dragging
      // just return
      if(this.vuescroll.state.isDragging) {
        return;
      }
      // add mousedown condition 
      // to prevent from hiding bar while dragging the bar 
      if(!this.mergedOptions.vBar.keepShow && !this.vuescroll.state.mousedown && this.vuescroll.state.pointerLeave) {
        this.vBar.state.opacity = 0;
      }
      if(!this.mergedOptions.hBar.keepShow && !this.vuescroll.state.mousedown && this.vuescroll.state.pointerLeave) {
        this.hBar.state.opacity = 0;
      }
    },
    setMousedown(val) {
      this.vuescroll.state.mousedown = val;
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
          this.showBar();
          this.hideBar();
          if(this.mode == "slide") {
            this.updateScroller();
          }
        }, false);
        let funcArr = [
          (nativeEvent) => {    
            /** 
                         *  set updateType to prevent
                         *  the conflict update of the `updated
                         *  hook` of the vuescroll itself. 
                         */
            this.vuescroll.state.updateType = "resize";
            if(this.mode == "slide") {
              this.updateScroller();
            }
            this.update("handle-resize", nativeEvent);
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
    recordCurrentPos(reverse) {
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
    // mode changes should record position reverse
    watchModeChanges() {
      // react to mode's change immediately.
      this.$watch("mergedOptions.vuescroll.mode", () => {
        // record current position
        // reverse: true
        this.recordCurrentPos(true);
      }, {
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
        "mergedOptions.vRail",
        "mergedOptions.hRail",
        "mergedOptions.vBar",
        "mergedOptions.hBar"
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
      // registry resize event
      this.registryResize();
      this.watchBreakingChanges();
      this.watchModeChanges();
      this.watchUncessaryChanges();
      // update state
      this.update();
      this.showBar();
      this.hideBar();
    }
  },
  updated() { 
    this.$nextTick(() => {
      if(!this._isDestroyed) {
        /* istanbul ignore if */
        if(this.vuescroll.state.updateType == "resize") {
          this.vuescroll.state.updateType = "";
          return;
        }
        this.update();
        this.showBar();
        this.hideBar();
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
    ops:{
      default() {
        /* istanbul ignore next */
        return {
          vuescroll: {

          },
          scrollPanel: {

          },
          scrollContent: {

          },
          vRail: {

          },
          vBar: {

          },
          hRail: {

          },
          hBar: {

          }
        };
      }
    }
  }
};