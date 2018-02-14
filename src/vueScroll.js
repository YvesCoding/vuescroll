// vuescroll core module

import {
    deepMerge,
    defineReactive,
    getComputed
} from './util'

import LifeCycleMix from './LifeCycleMix';
// import config
import GCF from './GlobalConfig' 
import {getGutter} from './util'
// import map
import scrollMap from './scrollMap'

export default  {
    name: "vueScroll",
    mixins: [LifeCycleMix],
    data() {
        return {
            scrollPanel: {
                el: ""
            },
            scrollContent: {
                state: {
                    style: {
                        minHeight: '100%',
                        boxSizing: 'border-box'
                    }
                }
            },
            vRail: {
                el: ""
            },
            vScrollbar: {
                el: "",
                state: {
                    top: 0,
                    height: 0,
                    opacity: 0
                }
            },
            hRail: {
                el: ""
            },
            hScrollbar: {
                el: "",
                state: {
                    left: 0,
                    width: 0,
                    opacity: 0,
                    pos: 'bottom'
                }
            },
            listeners: [],
            mousedown: false,
            isMouseLeavePanel: true,
            isWheeling: false,
            gutter: getGutter(),
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
    render(_c) {
        let vm = this;
        return _c('div', {
            class: 'vueScroll',
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                overflow: 'hidden'
            },
            on: {
                mouseenter() {
                    vm.isMouseLeavePanel = false;
                    vm.showBar();
                },
                mouseleave() {
                    vm.isMouseLeavePanel = true;
                    vm.hideBar();
                },
                mousemove() {
                    vm.isMouseLeavePanel = false;
                    vm.showBar();
                }
            },
        }, [_c('scrollPanel', {
            ref: 'scrollPanel',
            porps: {
            },
            on: {
                scrolling: vm.scroll,
                wheeling: vm.wheel
            }
        }, [_c('scrollContent', {
            props: {
                ops: vm.mergedOptions.scrollContent,
                state: vm.scrollContent.state
            }
        }, vm.$slots.default)]), _c('ScrollRail', {
            props: {
                ops: vm.mergedOptions.vRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            },
            ref: "vRail"
        }), _c("vBar", {
            props: {
                ops: vm.mergedOptions.vBar,
                state: vm.vScrollbar.state
            },
            ref: "vScrollbar"
        }), _c('hRail', {
            props: {
                ops: vm.mergedOptions.hRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            },
            ref: "hRail"
        }), _c('hBar', {
            props: {
                ops: vm.mergedOptions.hBar,
                state: vm.hScrollbar.state
            },
            ref: "hScrollbar"
        })]);
    },
    mounted() {
        this.initEl();
        this.initBarDrag();
        this.listenPanelTouch();
        // showbar at init time
        this.showBar();
        
    },
    methods: {
        initEl() {
            this.scrollPanel.el = this.$refs['scrollPanel'] && this.$refs['scrollPanel'].$el;
            this.vScrollbar.el = this.$refs['vScrollbar'] && this.$refs['vScrollbar'].$el;
            this.hScrollbar.el = this.$refs['hScrollbar'] && this.$refs['hScrollbar'].$el;
            this.hRail.el = this.$refs['hRail'] && this.$refs['hRail'].$el;
            this.vRail.el = this.$refs['vRail'] && this.$refs['vRail'].$el;
        },
        initBarDrag() {
            let vScrollbar = this.listenBarDrag('vScrollbar');
            let hScrollbar = this.listenBarDrag('hScrollbar');
            vScrollbar();
            hScrollbar();
        },
        scrollTo(pos) {
            let x = pos.x || this.scrollPanel.el.scrollLeft;
            let y = pos.y || this.scrollPanel.el.scrollTop;
            this.scrollPanel.el.scrollTo(x, y);
        },
        // get the bar height or width
        getBarPropertyValue(type, scrollPanelPropertyValue, scrollPanelScrollPropertyValue) {
            let property = type === 'vScrollbar' ? 'Height' : 'Width';
            // choose the proper height for scrollbar
            let scrollPropertyValue = scrollPanelPropertyValue / scrollPanelScrollPropertyValue;
            if ((scrollPanelScrollPropertyValue <= scrollPanelPropertyValue) || Math.abs(scrollPanelPropertyValue - scrollPanelScrollPropertyValue) <= this.accuracy) {
                scrollPropertyValue = 0;
            }
            return scrollPropertyValue;
        },
        // adjust a bar's position
        adjustBarPos(scrollPropertyValue, scrollPanelPropertyValue, scrollDirectionValue, scrollPanelScrollValue) {
            return parseFloat(scrollDirectionValue / scrollPanelPropertyValue);
        },
        // show All bar
        showBar() {
            this.showVBar();
            this.showHBar();
        },
        // hide all bar
        hideBar() {
            this.hideVBar();
            this.hideHBar();
        },
        // showVbar
        showVBar() {
            if (!this.isMouseLeavePanel || this.mergedOptions.vBar.keepShow || this.mousedown) {
                let scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'height').replace('px', "")) - this.gutter;
                let scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollHeight']);
                let scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollTop']);
                if ((this.vScrollbar.state.height = this.getBarPropertyValue('vScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.vScrollbar.state.top = this.adjustBarPos(this.vScrollbar.state.height, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.vScrollbar.state.opacity = this.mergedOptions.vBar.opacity;
                }
            }
        },
        // showHbar
        showHBar() {
            if (!this.isMouseLeavePanel || this.mergedOptions.hBar.keepShow || this.mousedown) {
                let scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'width').replace('px', ""))  - this.gutter;
                let scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollWidth']);
                let scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollLeft']);
                if ((this.hScrollbar.state.width = this.getBarPropertyValue('hScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.hScrollbar.state.left = this.adjustBarPos(this.hScrollbar.state.width, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.hScrollbar.state.opacity = this.mergedOptions.hBar.opacity;
                }
            }
        },
        // hideVbar
        hideVBar() {
            if (!this.mergedOptions.vBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.vScrollbar.state.opacity = 0;
                }
            }
        },
        // hideHbar
        hideHBar() {
            if (!this.mergedOptions.hBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.hScrollbar.state.opacity = 0;
                }
            }
        },
        wheel(e) {
            let vm = this;
            let delta = vm.mergedOptions.vBar.deltaY;
            vm.isWheeling = true;
            vm.showVBar();
            vm.scrollBar(e.deltaY > 0 ? delta : -delta, 'vScrollbar');
            e.preventDefault();
            e.stopPropagation();
        },
        // listen wheel scrolling
        scroll(e) {
            // console.log(e);
            if(this.isWheeling) {
                e.preventDefault();
                this.isWheeling = false;
                return;
            }
            this.showBar();
        },
        // scroll content and resize bar.
        scrollBar(distance, type) {
            // >0 scroll to down or right  <0 scroll to up or left
            let direction = type == 'vScrollbar' ? 'top' : 'left';
            let upperCaseDirection = type == 'vScrollbar' ? 'Top' : 'Left';
            let property = type == 'vScrollbar' ? 'height' : 'width';
            let upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            let event = type == 'vScrollbar' ? 'vscroll' : 'hscroll';
            let showEvent = type == 'vScrollbar' ? 'showVBar' : 'showHBar';
            let directionValue = this[type].state[direction];
            let scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "")  - this.gutter;
            if (type == 'vScrollbar') {
                scrollPanelPropertyValue = scrollPanelPropertyValue ;
            }
            let scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            let scrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
            let scrollPropertyValue = this[type].state[property];
            let ScrollDirectionValue = Math.round(scrollDirectionValue + distance);
            if (distance < 0) {
                // scroll up or left
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.max(0, ScrollDirectionValue);
            } /* istanbul ignore next */else if (distance > 0) {
                // scroll down or right
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.min(scrollPanelScrollValue - scrollPanelPropertyValue, ScrollDirectionValue);
            }
            this[showEvent]();
            let content = {};
            let bar = {};
            let process = "";
            
            ScrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
            content.residual = (scrollPanelScrollValue - ScrollDirectionValue - scrollPanelPropertyValue);
            content.scrolled = ScrollDirectionValue;
            bar.scrolled = this[type].state[direction];
            bar.residual = (content.residual / scrollPanelScrollValue) * scrollPanelPropertyValue;
            bar[property] = this[type].state[property] * scrollPanelPropertyValue;
            process = ScrollDirectionValue / (scrollPanelScrollValue - scrollPanelPropertyValue);
            bar.name = type;
            content.name = "content";
            this.$emit(event, bar, content, process);
        },
        // convert scrollbar's distance to content distance.
        _scrollContent(distance, type) {
            let property = type == 'vScrollbar' ? 'height' : 'width';
            let upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            let scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "")  - this.gutter ;
            let scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            let scrollContentDistance = scrollPanelScrollValue * (distance / scrollPanelPropertyValue);
            this.scrollBar(scrollContentDistance, type);
        },
        // click the rail and trigger the scrollbar moving
        scrollContentByBar(e, type) {
            let coco = type === 'vScrollbar' ? 'y' : 'x';
            let elementInfo = this[type].el.getBoundingClientRect();
            let delta = e[coco] - elementInfo[coco] - elementInfo.height / 2;
            this._scrollContent(delta, type);
        },
        listenBarDrag(type) {
            let vm = this;
            let coordinate = type === 'vScrollbar' ? 'pageY' : 'pageX';
            let bar = type === 'vScrollbar' ? 'VBar' : 'HBar';
            let scrollProperty = type === 'vScrollbar' ? 'scrollHeight' : 'scrollWidth';
            let property = type === 'vScrollbar' ? 'height' : 'width';
            return function() {
                let pre;
                let now;
                 
                function move(e) /* istanbul ignore next */{
                    now = e[coordinate];
                    let delta = now - pre;
                    vm['show' + bar]();
                    vm._scrollContent(delta, type);
                    pre = now;
                }
                
                function t(e) /* istanbul ignore next */{
                    e.stopPropagation();
                    vm.mousedown = true;
                    pre = e[coordinate];
                    vm['show' + bar]();
                    document.onselectstart = () => false;
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
                        document.onselectstart = null;
                        vm['hide' + bar]();
                        document.removeEventListener('mousemove', move);
                    });
                }
                vm.listeners.push({
                    dom: vm[type].el,
                    event: t,
                    type: "mousedown"
                });
                vm[type].el.addEventListener('mousedown', t);
            }
        },
        listenPanelTouch() {
            let vm = this;
            let pannel = this.scrollPanel.el;
            function t(e) /* istanbul ignore next */{
                if (e.touches.length) {
                    e.stopPropagation();
                    vm.mousedown = true;
                    vm.showBar();
                    pannel.addEventListener('touchend', function(e) {
                        vm.mousedown = false;
                        vm.hideBar();
                    });
                }
            }
            pannel.addEventListener('touchstart', t);
            vm.listeners.push({
                dom: pannel,
                event: t,
                type: "touchstart"
            });
        }
    },
    beforeDestroy() {
        // remove the registryed event.
        this.listeners.forEach(function(item) {
            item.dom.removeEventListener(item.type, item.event);
        });
    },
    updated() {
        this.showBar();
        this.hideBar();
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
            default: 5
        }
    }
}