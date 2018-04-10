// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
    getGutter,
    hideSystemBar,
    listenResize,
    createRefreshDomStyle
} from '../util';

// import mix begin.....

// import lefrCycle
import LifeCycleMix from '../mixins/LifeCycleMix';
// import api
import vuescrollApi from '../mixins/vueScrollApi';
// import native mode
import nativeMode from '../mixins/mode/native-mode'
// import slide mode
import slideMode from '../mixins/mode/slide-mode'
// import mix end......

// import necessary components
import bar from "./vuescrollBar";
import rail from "./vuescrollRail";
import scrollContent from './vueScrollContent';
import scrollPanel from './vueScrollPanel';

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
           
        },
        nativeOn: {
            scroll: vm.handleScroll
        },
        props: {
            ops: vm.mergedOptions.scrollPanel,
            state: vm.scrollPanel.state
        }
    }
    // set overflow only if the in native mode
    if(vm.mode == 'native') {
        // dynamic set overflow scroll
        scrollPanelData.style['overflowY'] = vm.vBar.state.size?'scroll':'inherit';
        scrollPanelData.style['overflowX'] = vm.hBar.state.size?'scroll':'inherit';
        let gutter = getGutter();
        if(!getGutter.isUsed) {
            getGutter.isUsed = true;
        }
        hideSystemBar();
        scrollPanelData.style.height = '100%';
        // clear unuseful styles...
        scrollPanelData.style.transformOrigin = '';
        scrollPanelData.style.transform = '';
    } else if(vm.mode == 'slide') {
        scrollPanelData.style['transformOrigin'] = 'left top 0px'
        scrollPanelData.style['userSelect'] = 'none';
    }
    return (
        <scrollPanel
            {...scrollPanelData}
        >
            {
                (function(){
                    if(vm.mode == 'native') {
                        return [createContent(h, vm)];
                    } else if(vm.mode == 'slide') {
                        let renderChildren = [vm.$slots.default];
                        if(vm.$slots.refresh && vm.mergedOptions.vuescroll.refresh) {
                            vm.$refs['refreshDom'] = vm.$slots.refresh[0];
                            renderChildren.unshift(vm.$slots.refresh[0])
                        } else if(vm.mergedOptions.vuescroll.refresh) {
                            createRefreshDomStyle();
                            // no slot refresh elm, use default
                            renderChildren.unshift(<div class="vuescroll-refresh" ref="refreshDom">refresh</div>)
                        }
                        return renderChildren;
                    }
                })()
            }
        </scrollPanel>
    )
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
    }
    return (
        <scrollContent
            {...scrollContentData}
        >
            {[vm.$slots.default]}
        </scrollContent>
    )
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
    const railOptionType = type === 'vertical'? 'vRail': 'hRail';
    const barOptionType = type === 'vertical'? 'vBar': 'hBar';

    const railData = {
        props: {
            type: type,
            ops: vm.mergedOptions[railOptionType],
            state: vm[railOptionType].state
        }
    }
    if(vm[barOptionType].state.size) {
        return (
            <rail 
            {...railData}
            />
        )
    }
    return null;
}

/**
 * create bars
 * 
 * @param {any} size 
 * @param {any} type 
 */
function createBar(h, vm, type) {
     // hBar data
     const barOptionType = type === 'vertical'? 'vBar': 'hBar';
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
    }
    if(vm[barOptionType].state.size) {
        return (
            <bar 
            {...barData}
            />
        )
    }
    return null;
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
                    mousedown: false,
                    pointerLeave: true,
                    timeoutId: 0,
                    updateType: '',
                    // for non-native scroll dimensions
                    internalScrollTop: 0,
                    internalScrollLeft: 0,
                    // merged options afer created hook
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
        }
    },
    render(h) {
        let vm = this;

        if(vm.shouldStopRender) {
            return (
                <div>
                    {[vm.$slots['default']]}
                </div>
            )
        }
        // vuescroll data
        const vuescrollData = {
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                padding: 0
            },
            class: 'vue-scroll',
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
        }
        if(this.mode == 'native') {
             // dynamic set overflow
            vuescrollData.style['overflowY'] = vm.vBar.state.size?'hidden':'inherit';
            vuescrollData.style['overflowX'] = vm.hBar.state.size?'hidden':'inherit';  
        }
        else if(this.mode == 'slide'){
            vuescrollData.style['overflow'] = 'hidden';
        }
        return (
            <div {...vuescrollData}>
                {createPanel(h, vm)}
                {createRail(h, vm, 'vertical')}
                {createBar(h, vm, 'vertical')}
                {createRail(h, vm, 'horizontal')}
                {createBar(h, vm, 'horizontal')}
            </div>
        )
    },
    computed: {
        scrollPanelElm() {
            return this.$refs.scrollPanel.$el;
        },
        mode() {
            return this.mergedOptions.vuescroll.mode
        }
    },
    methods: {
        // update function 
        // update some states of scrollbar
        update(eventType, nativeEvent = null) {
            if(this.mode == 'native') {
                this.updateNativeModeBarState();   
            }
            // else branch handle for other mode 
            else  if(this.mode == 'slide') {
                this.updateSlideModeBarState();
            }       
            // trigger event such as scroll or resize
            if(eventType) {
                this.emitEvent(eventType, nativeEvent);
            }
        },
        // when mode changes,
        // update it
        updateMode() {
            if(this.destroyScroller) {
                this.scroller.stop();
                this.destroyScroller();
                this.destroyScroller = null;
            }
            if(this.mode == 'slide') {
                this.destroyScroller = this.registryScroller();
            } else if(this.mode == 'native') {
                // remove the transform style attribute
                this.scrollPanelElm.style.transform = '';
                this.scrollPanelElm.style.transformOrigin = '';
            }
            this.scrollTo({
                x: this.vuescroll.state.internalScrollLeft,
                y: this.vuescroll.state.internalScrollTop 
            }, false);
        },
        handleScroll(nativeEvent) {
            this.update('handle-scroll', nativeEvent);
            this.showAndDefferedHideBar();
        },
        showAndDefferedHideBar() {
            this.showBar();
            if(this.vuescroll.state.timeoutId) {
                clearTimeout(this.vuescroll.state.timeoutId);
            }
            this.vuescroll.state.timeoutId = setTimeout(() => {
               this.vuescroll.state.timeoutId = 0;
               this.hideBar();
           }, 500);
        },
        emitEvent(eventType, nativeEvent = null) {
            const scrollPanel = this.scrollPanelElm;
            let vertical = {
                type: 'vertical'
            }, horizontal = {
                type: 'horizontal'
            };
            let scrollTop = scrollPanel.scrollTop;
            let scrollLeft = scrollPanel.scrollLeft;
            if(this.mode == 'slide') {
                scrollTop = this.scroller.__scrollTop;
                scrollLeft = this.scroller.__scrollLeft;
            }
            vertical['process'] = scrollTop / (scrollPanel.scrollHeight - scrollPanel.clientHeight);
            horizontal['process'] = scrollLeft / (scrollPanel.scrollWidth - scrollPanel.clientWidth);
            vertical['barSize'] = this.vBar.state.size;
            horizontal['barSize'] = this.hBar.state.size;
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
            /* istanbul ignore next */
            {
                if(this.destroyResize) {
                    // when toggling the mode
                    // we should clean the flag  object.
                    this.destroyResize();
                }
                let contentElm = null;
                if(this.mode == 'slide') {

                    contentElm = this.scrollPanelElm;

                } else if(this.mode == 'native') {
                    // because we can customize the tag
                    // of the scrollContent, so, scrollContent
                    // maybe a dom or a component
                    if(this.$refs['scrollContent']._isVue) {
                        contentElm = this.$refs['scrollContent'].$el;
                    }else {
                        contentElm = this.$refs['scrollContent'];
                    }
                }                
                window.addEventListener("resize", () => {
                    this.update();
                    this.showBar();
                    this.hideBar();
                    if(this.mode == 'slide') {
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
                        this.vuescroll.state.updateType = 'resize';
                        if(this.mode == 'slide') {
                            this.updateScroller();
                        }
                        this.update('handle-resize', nativeEvent);
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
                )
            }
        }
    },
    mounted() {
        if(!this._isDestroyed && !this.shouldStopRender) {
            if(this.mode == 'slide') {
                this.destroyScroller = this.registryScroller();
            }
            // registry resize event
            this.registryResize();
            this.$watch('mergedOptions.vuescroll.mode', () => {
                this.registryResize();
                this.updateMode();
            })
            // react to sync's change sync.
            this.$watch('mergedOptions.vuescroll.mode', () => {
                // record the scrollLeft and scrollTop
                // by judging the last mode
                if(this.mode == 'native') {
                    this.vuescroll.state.internalScrollLeft = this.scroller.__scrollLeft
                    this.vuescroll.state.internalScrollTop = this.scroller.__scrollTop
                }else if(this.mode == 'slide'){
                    this.vuescroll.state.internalScrollLeft = this.scrollPanelElm.scrollLeft
                    this.vuescroll.state.internalScrollTop = this.scrollPanelElm.scrollTop
                }
            }, {
                sync: true
            })

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
                if(this.vuescroll.state.updateType == 'resize') {
                    this.vuescroll.state.updateType = '';
                    return;
                }
                this.update();
                this.showBar();
                this.hideBar();
            }
        }) 
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
               }
            }
        }
    }
}