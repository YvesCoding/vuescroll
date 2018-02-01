// vuescroll core module

import {
    deepMerge,
    defineReactive,
    getComputed
} from './util'

import LifeCycleMix from './LifeCycleMix';

// import config
import GCF from './GlobalConfig' 

export default  {
    name: "vueScroll",
    mixins: [LifeCycleMix],
    data: function() {
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
            fOps: {
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
    render: function(_c) {
        var vm = this;
        return _c('div', {
            class: 'vueScroll',
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                overflow: 'hidden'
            },
            on: {
                mouseenter: function() {
                    vm.isMouseLeavePanel = false;
                    vm.showBar();
                },
                mouseleave: function() {
                    vm.isMouseLeavePanel = true;
                    vm.hideBar();
                },
                mousemove: function() {
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
                ops: vm.fOps.scrollContent,
                state: vm.scrollContent.state
            }
        }, vm.$slots.default)]), _c('vRail', {
            props: {
                ops: vm.fOps.vRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            },
            ref: "vRail"
        }), _c("vBar", {
            props: {
                ops: vm.fOps.vBar,
                state: vm.vScrollbar.state
            },
            ref: "vScrollbar"
        }), _c('hRail', {
            props: {
                ops: vm.fOps.hRail
            },
            on: {
                scrollContentByBar: vm.scrollContentByBar
            },
            ref: "hRail"
        }), _c('hBar', {
            props: {
                ops: vm.fOps.hBar,
                state: vm.hScrollbar.state
            },
            ref: "hScrollbar"
        })]);
    },
    mounted: function() {
        this.initEl();
        this.initBarDrag();
        this.listenPanelTouch();
        // showbar at init time
        this.showBar();
    },
    methods: {
        initEl: function() {
            this.scrollPanel.el = this.$refs['scrollPanel'] && this.$refs['scrollPanel'].$el;
            this.vScrollbar.el = this.$refs['vScrollbar'] && this.$refs['vScrollbar'].$el;
            this.hScrollbar.el = this.$refs['hScrollbar'] && this.$refs['hScrollbar'].$el;
            this.hRail.el = this.$refs['hRail'] && this.$refs['hRail'].$el;
            this.vRail.el = this.$refs['vRail'] && this.$refs['vRail'].$el;
        },
        initBarDrag: function() {
            var vScrollbar = this.listenBarDrag('vScrollbar');
            var hScrollbar = this.listenBarDrag('hScrollbar');
            vScrollbar();
            hScrollbar();
        },
        scrollTo: function(pos) {
            var x = pos.x || this.scrollPanel.el.scrollLeft;
            var y = pos.y || this.scrollPanel.el.scrollTop;
            this.scrollPanel.el.scrollTo(x, y);
        },
        // get the bar height or width
        getBarPropertyValue: function(type, scrollPanelPropertyValue, scrollPanelScrollPropertyValue) {
            var property = type === 'vScrollbar' ? 'Height' : 'Width';
            // choose the proper height for scrollbar
            var scrollPropertyValue = scrollPanelPropertyValue / scrollPanelScrollPropertyValue;
            if ((scrollPanelScrollPropertyValue <= scrollPanelPropertyValue) || Math.abs(scrollPanelPropertyValue - scrollPanelScrollPropertyValue) <= this.accuracy) {
                scrollPropertyValue = 0;
            }
            return scrollPropertyValue;
        },
        // adjust a bar's position
        adjustBarPos: function(scrollPropertyValue, scrollPanelPropertyValue, scrollDirectionValue, scrollPanelScrollValue) {
            return parseFloat(scrollDirectionValue / scrollPanelPropertyValue);
        },
        // show All bar
        showBar: function() {
            this.showVBar();
            this.showHBar();
        },
        // hide all bar
        hideBar: function() {
            this.hideVBar();
            this.hideHBar();
        },
        // showVbar
        showVBar: function() {
            if (!this.isMouseLeavePanel || this.fOps.vBar.keepShow || this.mousedown) {
                var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'height').replace('px', ""));
                var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollHeight']);
                var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollTop']);
                if ((this.vScrollbar.state.height = this.getBarPropertyValue('vScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.vScrollbar.state.top = this.adjustBarPos(this.vScrollbar.state.height, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.vScrollbar.state.opacity = this.fOps.vBar.opacity;
                }
            }
        },
        // showHbar
        showHBar: function() {
            if (!this.isMouseLeavePanel || this.fOps.hBar.keepShow || this.mousedown) {
                var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'width').replace('px', ""));
                var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollWidth']);
                var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollLeft']);
                if ((this.hScrollbar.state.width = this.getBarPropertyValue('hScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                    this.hScrollbar.state.left = this.adjustBarPos(this.vScrollbar.state.width, scrollPanelPropertyValue - 0, scrollDirectionValue, scrollPanelScrollPropertyValue);
                    this.hScrollbar.state.opacity = this.fOps.hBar.opacity;
                }
            }
        },
        // hideVbar
        hideVBar: function() {
            if (!this.fOps.vBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.vScrollbar.state.opacity = 0;
                }
            }
        },
        // hideHbar
        hideHBar: function() {
            if (!this.fOps.hBar.keepShow) {
                if (!this.mousedown && this.isMouseLeavePanel) {
                    this.hScrollbar.state.opacity = 0;
                }
            }
        },
        wheel: function(e) {
            var vm = this;
            var delta = vm.fOps.vBar.deltaY;
            vm.isWheeling = true;
            vm.showVBar();
            vm.scrollBar(e.deltaY > 0 ? delta : -delta, 'vScrollbar');
            e.preventDefault();
            e.stopPropagation();
        },
        // listen wheel scrolling
        scroll: function(e) {
            // console.log(e);
            if(this.isWheeling) {
                e.preventDefault();
                this.isWheeling = false;
                return;
            }
            this.showBar();
        },
        // scroll content and resize bar.
        scrollBar: function(distance, type) {
            // >0 scroll to down or right  <0 scroll to up or left
            var direction = type == 'vScrollbar' ? 'top' : 'left';
            var upperCaseDirection = type == 'vScrollbar' ? 'Top' : 'Left';
            var property = type == 'vScrollbar' ? 'height' : 'width';
            var upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            var event = type == 'vScrollbar' ? 'vscroll' : 'hscroll';
            var showEvent = type == 'vScrollbar' ? 'showVBar' : 'showHBar';
            var directionValue = this[type].state[direction];
            var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "");
            if (type == 'vScrollbar') {
                scrollPanelPropertyValue = scrollPanelPropertyValue ;
            }
            var scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            var scrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
            var scrollPropertyValue = this[type].state[property];
            var ScrollDirectionValue = Math.round(scrollDirectionValue + distance);
            if (distance < 0) {
                // scroll up or left
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.max(0, ScrollDirectionValue);
            } /* istanbul ignore next */else if (distance > 0) {
                // scroll down or right
                this.scrollPanel.el['scroll' + upperCaseDirection] = Math.min(scrollPanelScrollValue - scrollPanelPropertyValue, ScrollDirectionValue);
            }
            this[showEvent]();
            var content = {};
            var bar = {};
            var process = "";
            
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
        _scrollContent: function(distance, type) {
            var property = type == 'vScrollbar' ? 'height' : 'width';
            var upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
            var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "")  ;
            if (type == 'vScrollbar') {
                scrollPanelPropertyValue = scrollPanelPropertyValue  ;
            }
            var scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
            var scrollContentDistance = scrollPanelScrollValue * (distance / scrollPanelPropertyValue);
            this.scrollBar(scrollContentDistance, type);
        },
        // click the rail and trigger the scrollbar moving
        scrollContentByBar: function(e, type) {
            var coco = type === 'vScrollbar' ? 'y' : 'x';
            var elementInfo = this[type].el.getBoundingClientRect();
            var delta = e[coco] - elementInfo[coco] - elementInfo.height / 2;
            this._scrollContent(delta, type);
        },
        listenBarDrag: function(type) {
            var vm = this;
            var coordinate = type === 'vScrollbar' ? 'pageY' : 'pageX';
            var bar = type === 'vScrollbar' ? 'VBar' : 'HBar';
            var scrollProperty = type === 'vScrollbar' ? 'scrollHeight' : 'scrollWidth';
            var property = type === 'vScrollbar' ? 'height' : 'width';
            return function() {
                var pre;
                var now;
                 
                function move(e) /* istanbul ignore next */{
                    now = e[coordinate];
                    var delta = now - pre;
                    vm['show' + bar]();
                    vm._scrollContent(delta, type);
                    pre = now;
                }
                
                function t(e) /* istanbul ignore next */{
                    e.stopPropagation();
                    vm.mousedown = true;
                    pre = e[coordinate];
                    vm['show' + bar]();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
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
        listenPanelTouch: function() {
            var vm = this;
            var pannel = this.scrollPanel.el;
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
    beforeDestroy: function() {
        // remove the registryed event.
        this.listeners.forEach(function(item) {
            item.dom.removeEventListener(item.type, item.event);
        });
    },
    updated: function() {
        this.showBar();
        this.hideBar();
    },
    props: {
        ops:{
            default: function() {
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