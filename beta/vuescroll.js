// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
import {
    deepMerge,
    defineReactive
} from './util'
// import lefrCycle
import LifeCycleMix from './LifeCycleMix';
// import global config
import GCF from './GlobalConfig' 
import {getGutter} from './util'
// import vuescroll map
import scrollMap from './scrollMap'
// import necessary components
import bar from "./vuescrollBar";
// import rail from "./vuescrollRail"
// import scrollContent from './vueScrollContent'
// import scrollPanel from './vueScrollPanel'
export default  {
    name: "vueScroll",
    mixins: [LifeCycleMix],
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
            mergedOptions: {
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
            style: gfc.vuescroll.style,
            class: gfc.vuescroll.class,
            on: {
                mouseenter() {
                    this.showBar();
                },
                mouseleave() {
                    this.hideBar();
                }
            }
        }
        // scrollPanel data
        const scrollPanelData = {
            ref: "scrollPanel",
            on: {
                scroll: this.handleScroll
            }
        }
        // scrollContent data
        const scrollContentData = {
            props: {
                ops: this.mergedOptions.scrollContent
            },
            ref: "scrollContent"
        }
        // vBar data
        const verticalBarData = {
            props: {
                type: "vertical",
                ops: this.mergedOptions.vBar,
                state: this.vBar.state
            },
            directives: {
                name: "bind",
                modifiers: {
                    sync: true
                },
                arg: 'mousedown'
                ,
                value: this.mousedown
            }
        }
        // vRail data
        const verticalRailData = {
            props: {
                type: "vertical",
                ops: this.mergedOptions.vRail,
                state: this.vRail.state
            }
        }
        // hBar data
        const horizontalBarData = {
            props: {
                type: "horizontal",
                ops: this.mergedOptions.hBar,
                state: this.hBar.state
            },
            directives: {
                name: "bind",
                modifiers: {
                    sync: true
                },
                arg: 'mousedown'
                ,
                value: this.mousedown
            }
        }
        // hRail data
        const horizontalRailData = {
            props: {
                type: "horizontal",
                ops: this.mergedOptions.hRail,
                state: this.hRail.state
            }
        }
        return (
            <div {...vuescrollData}>
                <scrollPanel
                   {...scrollPanelData}
                >
                    <scrollContent
                        {...scrollContentData}
                    >
                        {[this.$slots.default]}
                    </scrollContent>
                </scrollPanel>
                <bar
                    {...verticalBarData}
                />
                <rail 
                    {...verticalRailData}
                />
                <bar 
                    {...horizontalBarData}
                />
                <rail
                   {...horizontalRailData}
                />
            </div>
        );
    },
    computed: {
        scrollPanelRef() {
            return this.$refs.scrollPanel.$el;
        }
    },
    methods: { 
        handleScroll() {
            this.showBar();
        },
        update() {
            let heightPercentage, widthPercentage;
            const scrollPanel = this.scrollPanelRef;
            if (!scrollPanel) return;
      
            heightPercentage = (scrollPanel.clientHeight * 100 / (scrollPanel.scrollHeight - this.accuracy));
            widthPercentage = (scrollPanel.clientWidth * 100 / (scrollPanel.scrollWidth - this.accuracy));

            this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + '%') : '';
            this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + '%') : '';

            this.vBar.state.posValue =  ((scrollPanel.scrollTop * 100) / scrollPanel.clientHeight);
            this.hBar.state.posValue =  ((scrollPanel.scrollLeft * 100) / scrollPanel.clientWidth);
        },
        showBar() {
            this.update();
            this.vBar.state.opacity =  this.mergedOptions.vBar.opacity;
            this.hBar.state.opacity =  this.mergedOptions.hBar.opacity;
        },
        hideBar() {
            // add mousedown condition 
            // to prevent from hiding bar while dragging the bar 
            if(!this.mergedOptions.vBar.keepShow && !this.mousedown) {
                this.vBar.state.opacity = 0;
            }
            if(!this.mergedOptions.hBar.keepShow && !this.mousedown) {
                this.hBar.state.opacity = 0;
            }
        }  
    },
    mounted() {
        this.$nextTick(() => {
            this.showBar();
            this.hideBar();
        }) 
    },
    updated() { 
        this.$nextTick(() => {
            this.showBar();
            this.hideBar();
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
               return {
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