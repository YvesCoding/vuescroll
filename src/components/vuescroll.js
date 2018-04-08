// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
    deepMerge,
    defineReactive,
    getGutter,
    hideSystemBar,
    listenResize
} from '../util';

// import lefrCycle
import LifeCycleMix from '../mixins/LifeCycleMix';

// import global config
import GCF from '../config/GlobalConfig';

// import api
import vuescrollApi from '../mixins/vueScrollApi';

// import necessary components
import bar from "./vuescrollBar";
import rail from "./vuescrollRail";
import scrollContent from './vueScrollContent';
import scrollPanel from './vueScrollPanel';

// import scroller
import Scroller from '../util/scroller'
import {
    render 
} from '../util/scroller/render'
import {
    listenContainer
}from '../util/scroller/listener'
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
    } else {
        scrollPanelData.style['userSelect'] = 'none';
    }
    return (
        <scrollPanel
            {...scrollPanelData}
        >
            {vm.mode == 'native'?createContent(h, vm): [vm.$slots.default]}
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
    mixins: [LifeCycleMix, vuescrollApi],
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
        else {
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
        updateScroller() {
            const clientWidth = this.$el.clientWidth;
            const clientHeight = this.$el.clientHeight;
            const contentWidth = this.scrollPanelElm.scrollWidth;
            const contentHeight = this.scrollPanelElm.scrollHeight;
            this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
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
            vertical['process'] = scrollPanel.scrollTop / (scrollPanel.scrollHeight - scrollPanel.clientHeight);
            horizontal['process'] = scrollPanel.scrollLeft / (scrollPanel.scrollWidth - scrollPanel.clientWidth);
            vertical['barSize'] = this.vBar.state.size;
            horizontal['barSize'] = this.hBar.state.size;
            this.$emit(eventType, vertical, horizontal, nativeEvent);
        },
        update(eventType, nativeEvent = null) {
            let heightPercentage, widthPercentage;
            const scrollPanel = this.scrollPanelElm;
            const vuescroll = this.$el;
            /* istanbul ignore if */
            if (!scrollPanel) return;

            if(this.mode == 'native') {
                heightPercentage = (scrollPanel.clientHeight * 100 / scrollPanel.scrollHeight);
                widthPercentage = (scrollPanel.clientWidth * 100 / scrollPanel.scrollWidth);    
                this.vBar.state.posValue =  ((scrollPanel.scrollTop * 100) / scrollPanel.clientHeight);
                this.hBar.state.posValue =  ((scrollPanel.scrollLeft * 100) / scrollPanel.clientWidth);    
            }
            // else branch handle for other mode 
            else  {
                // update scroller first then 
                // calculate state
                // prevent from infinite update
                if(nativeEvent !== false) {
                    this.updateScroller();
                }
                // update non-native scrollbars' state
                const scroller = this.scroller;
                let outerLeft = 0;
                let outerTop = 0;
                const clientWidth = vuescroll.clientWidth;
                const clientHeight = vuescroll.clientHeight;
                const contentWidth = this.scrollPanelElm.scrollWidth;
                const contentHeight = this.scrollPanelElm.scrollHeight;
                const __enableScrollX = clientWidth < contentWidth;
                const __enableScrollY = clientHeight < contentHeight;
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
                this.vBar.state.posValue =  (((scrollTop + outerTop) * 100) / vuescroll.clientHeight);
                this.hBar.state.posValue =  (((scrollLeft + outerLeft) * 100) / vuescroll.clientWidth);    
                if(scroller.__scrollLeft < 0) {
                    this.hBar.state.posValue = 0;
                }
                if(scroller.__scrollTop < 0) {
                    this.vBar.state.posValue = 0;
                }
            }
            this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + '%') : 0;
            this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + '%') : 0;
        
            // trigger event such as scroll or resize
            if(eventType) {
                this.emitEvent(eventType, nativeEvent);
            }
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
                const contentElm = this.mode!== 'native'?this.scrollPanelElm: this.$refs['scrollContent']._isVue?this.$refs['scrollContent'].$el:this.$refs['scrollContent'];
                
                window.addEventListener("resize", () => {
                    this.update();
                    this.showBar();
                    this.hideBar();
                }, false);
                let funcArr = [
                    (nativeEvent) => {    
                        /** 
                         *  set updateType to prevent
                         *  the conflict update of the `updated
                         *  hook` of the vuescroll itself. 
                         */
                        this.vuescroll.state.updateType = 'resize';
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
        },
        registryScroller() {
            // Initialize Scroller
            this.scroller = new Scroller(render(this.scrollPanelElm, window), {
                zooming: true
            });
            var rect = this.$el.getBoundingClientRect();
            this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop);    
            const cb = listenContainer(this.$el, this.scroller, (eventType) => {
                switch(eventType) {
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
            });
            // this.scroller.scrollTo(this.scrollPanelElm)
            this.updateScroller();
            return cb;
        }
    },
    mounted() {
        this.$nextTick(() => {
            if(!this._isDestroyed) {
                if(this.mode !== 'native') {
                    this.destroyScroller = this.registryScroller();
                }
                // registry resize event
                this.registryResize();
                this.$watch('mergedOptions.vuescroll.mode', () => {
                    this.registryResize();
                    if(this.destroyScroller) {
                        this.destroyScroller();
                        this.destroyScroller = null;
                    }
                    if(this.mode !== 'native') {
                        this.destroyScroller = this.registryScroller();
                        this.scroller.scrollTo(
                            this.vuescroll.state.internalScrollLeft,
                            this.vuescroll.state.internalScrollTop,
                            false
                        )
                    } else {
                        this.scrollPanelElm.style.transform = ''
                        this.scrollTo({
                            x: this.vuescroll.state.internalScrollLeft,
                            y: this.vuescroll.state.internalScrollTop 
                        }, false);
                    }
                })
                // react to sync's change sync.
                this.$watch('mergedOptions.vuescroll.mode', () => {
                    // record the scrollLeft and scrollTop
                    // by judging the last mode
                    if(this.mode == 'native') {
                        this.vuescroll.state.internalScrollLeft = this.scroller.__scrollLeft
                        this.vuescroll.state.internalScrollTop = this.scroller.__scrollTop
                    }else {
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
        }) 
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