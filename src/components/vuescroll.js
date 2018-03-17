// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
    deepMerge,
    defineReactive
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
            style: GCF.vuescroll.style,
            class: GCF.vuescroll.class,
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
        // scrollPanel data
        const scrollPanelData = {
            ref: "scrollPanel",
            nativeOn: {
                scroll: vm.handleScroll
            },
            props: {
                ops: vm.mergedOptions.scrollPanel,
            }
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

            this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + '%') : '';
            this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + '%') : '';

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