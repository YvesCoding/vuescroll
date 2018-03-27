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
        }
    }
    // dynamic set overflow scroll
    scrollPanelData.style['overflowY'] = vm.vBar.state.size?'scroll':'inherit';
    scrollPanelData.style['overflowX'] = vm.hBar.state.size?'scroll':'inherit';
    let gutter = getGutter();
    if(!getGutter.isUsed) {
        getGutter.isUsed = true;
    }
    hideSystemBar();
    scrollPanelData.style.height = '100%';
    
    return (
        <scrollPanel
            {...scrollPanelData}
        >
            {createContent(h, vm)}
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
            scrollPanel: {
                el: ""
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
            listeners: [],
            mousedown: false,
            pointerLeave: true,
            timeoutId: 0,
            updateType: '',
            mergedOptions: {
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
            class: 'vueScroll',
            on: {
                mouseenter() {
                    vm.pointerLeave = false;
                    vm.showBar();
                    vm.update();
                },
                mouseleave() {
                    vm.pointerLeave = true;
                    vm.hideBar();
                },
                mousemove()/* istanbul ignore next */{
                    vm.pointerLeave = false;
                    vm.showBar();
                    vm.update();
                }
            }
        }
        // dynamic set overflow
        vuescrollData.style['overflowY'] = vm.vBar.state.size?'hidden':'inherit';
        vuescrollData.style['overflowX'] = vm.hBar.state.size?'hidden':'inherit';
        
        return (
            <div {...vuescrollData}>
                {createPanel(h, vm)}
                {createRail(h, vm, 'vertical')}
                {createBar(h, vm, 'vertical')}
                {createRail(h, vm, 'horizontal')}
                {createBar(h, vm, 'horizontal')}
            </div>
        );
    },
    computed: {
        scrollPanelElm() {
            return this.$refs.scrollPanel.$el;
        }
    },
    methods: {
        handleScroll() {
            this.update();
            this.showAndDefferedHideBar();
        },
        showAndDefferedHideBar() {
            this.showBar();
            if(this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
               this.timeoutId = 0;
               this.hideBar();
           }, 500);
        },
        triggerScrollEvent() {
            const scrollPanel = this.scrollPanelElm;
            let vertical = {

            }, horizontal = {

            };
            vertical['process'] = scrollPanel.scrollTop / (scrollPanel.scrollHeight - scrollPanel.clientHeight);
            horizontal['process'] = scrollPanel.scrollLeft / (scrollPanel.scrollWidth - scrollPanel.clientWidth);
            vertical['barSize'] = this.vBar.state.size;
            horizontal['barSize'] = this.hBar.state.size;
            this.$emit('handle-scroll', vertical, horizontal);
        },
        update() {
            let heightPercentage, widthPercentage;
            const scrollPanel = this.scrollPanelElm;
            /* istanbul ignore if */
            if (!scrollPanel) return;
      
            heightPercentage = (scrollPanel.clientHeight * 100 / scrollPanel.scrollHeight);
            widthPercentage = (scrollPanel.clientWidth * 100 / scrollPanel.scrollWidth);

            this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + '%') : 0;
            this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + '%') : 0;

            this.vBar.state.posValue =  ((scrollPanel.scrollTop * 100) / scrollPanel.clientHeight);
            this.hBar.state.posValue =  ((scrollPanel.scrollLeft * 100) / scrollPanel.clientWidth);

            // trigger scroll event
            this.triggerScrollEvent();
        },
        showBar() {
            this.vBar.state.opacity =  this.mergedOptions.vBar.opacity;
            this.hBar.state.opacity =  this.mergedOptions.hBar.opacity;
        },
        hideBar() {
            // add mousedown condition 
            // to prevent from hiding bar while dragging the bar 
            if(!this.mergedOptions.vBar.keepShow && !this.mousedown && this.pointerLeave) {
                this.vBar.state.opacity = 0;
            }
            if(!this.mergedOptions.hBar.keepShow && !this.mousedown && this.pointerLeave) {
                this.hBar.state.opacity = 0;
            }
        },
        setMousedown(val) {
            this.mousedown = val;
        }  
    },
    mounted() {
        this.$nextTick(() => {
            if(!this._isDestroyed) {
                this.update();
                this.showBar();
                this.hideBar();
                /* istanbul ignore next */
                {
                    window.addEventListener("resize", () => {
                        this.update();
                        this.showBar();
                        this.hideBar();
                    }, false);
                    let funcArr = [
                        () => {
                            this.updateType = 'resize';
                            this.update();
                            this.showAndDefferedHideBar();
                        }
                    ];
                    if(this.$listeners['handle-resize']) {
                        funcArr.push(this.$listeners['handle-resize']);
                    }
                    // registry resize event
                    const contentElm = this.$refs['scrollContent']._isVue?this.$refs['scrollContent'].$el:this.$refs['scrollContent'];

                    listenResize(
                        contentElm
                        ,
                        funcArr
                    )
                }
            }
        }) 
    },
    updated() { 
        this.$nextTick(() => {
            if(!this._isDestroyed) {
                /* istanbul ignore if */
                if(this.updateType == 'resize') {
                    this.updateType = '';
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