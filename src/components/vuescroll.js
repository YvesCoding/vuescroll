// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
    deepMerge,
    defineReactive,
    getGutter
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
            overflowY: true,
            overflowX: true,
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
        vuescrollData.style['overflowY'] = vm.vBar.state.size?'hidden':'visible';
        vuescrollData.style['overflowX'] = vm.hBar.state.size?'hidden':'visible';
        
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
        scrollPanelData.style['overflowY'] = vm.vBar.state.size?'scroll':'visible';
        scrollPanelData.style['overflowX'] = vm.hBar.state.size?'scroll':'visible';
        let gutter = getGutter();
        if(!getGutter.isUsed) {
            getGutter.isUsed = true;
        }
        if(gutter) {
            scrollPanelData.style.marginRight = vm.hBar.state.size?-gutter + 'px': 0;
            scrollPanelData.style.height = `calc(100% + ${gutter}px)`;
            scrollPanelData.style.marginBottom = -gutter + 'px';
        } else /* istanbul ignore next */{
            scrollPanelData.style.height = '100%';
        }
        
        // scrollContent data
        const scrollContentData = {
            props: {
                ops: vm.mergedOptions.scrollContent,
            },
            ref: "scrollContent"
        }
        // vBar data
        const verticalBarData = {
            props: {
                type: "vertical",
                ops: vm.mergedOptions.vBar,
                state: vm.vBar.state
            },
            on: {
                setMousedown: this.setMousedown
            },
            ref: 'verticalBar'
        }
        // vRail data
        const verticalRailData = {
            props: {
                type: "vertical",
                ops: vm.mergedOptions.vRail,
                state: vm.vRail.state
            },
            ref: 'verticalRail'
        }
        // hBar data
        const horizontalBarData = {
            props: {
                type: "horizontal",
                ops: vm.mergedOptions.hBar,
                state: vm.hBar.state
            },
            on: {
                setMousedown: this.setMousedown
            },
            ref: 'horizontalBar'
        }
        // hRail data
        const horizontalRailData = {
            props: {
                type: "horizontal",
                ops: vm.mergedOptions.hRail,
                state: vm.hRail.state
            },
            ref: 'horizontalRail'
        }
        return (
            <div {...vuescrollData}>
                <scrollPanel
                   {...scrollPanelData}
                >
                    <scrollContent
                        {...scrollContentData}
                    >
                        {[vm.$slots.default]}
                    </scrollContent>
                </scrollPanel>
               
                <rail 
                    {...verticalRailData}
                />
                 <bar
                    {...verticalBarData}
                />
                
                <rail
                   {...horizontalRailData}
                />
                <bar 
                    {...horizontalBarData}
                />
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
            if(this.pointerLeave) {
                if(this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.showAndDefferedHideBar();
            }
        },
        showAndDefferedHideBar() {
            this.showBar();
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
      
            heightPercentage = (scrollPanel.clientHeight * 100 / (scrollPanel.scrollHeight - this.accuracy));
            widthPercentage = (scrollPanel.clientWidth * 100 / (scrollPanel.scrollWidth - this.accuracy));

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
            }
        }) 
    },
    updated() { 
        this.$nextTick(() => {
            if(!this._isDestroyed) {
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
        },
        accuracy: {
            default: 0,
            validator(value) {
                if(value < 0) {
                    console.error('[vuescroll]:The prop `accury` must be 0 or higher!')
                    return false;
                }
                return true;
            }
        }
    }
}