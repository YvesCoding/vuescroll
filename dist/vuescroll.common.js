/*
    * @name: vuescroll 3.3.9
    * @author: (c) 2018-2018 wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x inspired by slimscroll
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
'use strict';

// vertical rail
var vRail = {
    name: 'vRail',
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: '100%',
            width: vm.ops.width,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'vScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops:{
            default: function() {
                /* istanbul ignore next */
                return {
                    width: {
                        default: '5px'
                    },
                    pos: {
                        default: 'left'
                    },
                    background: {
                        default: '#a5d6a7'
                    },
                    opacity: {
                        default: '0.5'
                    }
                }
            }
        } 
    }
}

// vertical scrollBar
var vScrollbar = {
    name: 'vBar',
    computed: {
        computedTop() {
            return this.state.top * 100;
        },
        computedHeight() {
            return this.state.height * 100
        }
    },
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: vm.computedHeight + '%',
            width: vm.ops.width,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateY(" + vm.computedTop + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        };
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            class: "vScrollbar"
        });
    },
    props: {
        ops: {
            default: function(){
                /* istanbul ignore next */
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'left',
                    width: '5px'
                } 
            }
        },
        state: {
            default:function(){
                /* istanbul ignore next */
                return {
                    top: {
                        default: 0
                    },
                    height: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            } 
        }
    }
}

// horizontal rail
var hRail = {
    name: 'hRail',
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            height: vm.ops.height,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'hScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops: {
            default: function(){
                /* istanbul ignore next */
                return {
                    height: {
                        default: '5px'
                    },
                    pos: {
                        default: 'bottom'
                    },
                    background: {
                        default: '#a5d6a7'
                    },
                    opacity: {
                        default: '0.5'
                    }
                }
            }
        }
         
    }
}

// horizontal scrollBar
var hScrollbar = {
    name: 'hBar',
    computed: {
        computedLeft: function() {
            return this.state.left * 100;
        },
        computedWidth: function() {
            return this.state.width * 100
        }
    },
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            width: vm.computedWidth + '%',
            height: vm.ops.height,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateX(" + vm.computedLeft + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        };
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }
        return _c('div', {
            style: style,
            class: "hScrollbar"
        });
    },
    props: {
        ops: {
            default: function() {
                /* istanbul ignore next */
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'bottom',
                    height: '5px'
                }   
            }
        },
        state: {
            default: function(){
                /* istanbul ignore next */
                return {
                    left: {
                        default: 0
                    },
                    width: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            }
        }
    }
}

/**
     * @description return the computed value of a dom
     * @author wangyi7099
     * @param {any} dom 
     * @param {any} property 
     */
    function getComputed(dom, property) {
        return window.getComputedStyle(dom).getPropertyValue(property);
    }

    /**
     * @description deepCopy a object.
     * 
     * @param {any} source 
     * @returns 
     */
    function deepCopy(source, target) {
        target = typeof target === 'object'&&target || {};
        for (var key in source) {
            target[key] = typeof source[key] === 'object' ? deepCopy(source[key], target[key] = {}) : source[key];
        }
        return target;
    }
    
    /**
     * 
     * @description deepMerge a object.
     * @param {any} from 
     * @param {any} to 
     */
    function deepMerge(from, to) {
        to = to || {};
        for (var key in from) {
            if (typeof from[key] === 'object') {
                if (!to[key]) {
                    to[key] = {};
                    deepCopy(from[key], to[key]);
                } else {
                    deepMerge(from[key], to[key]);
                }
            } else {
                if(!to[key])
                to[key] = from[key];
            }
        }
        return to;
    }
    /**
     * @description define a object reactive
     * @author wangyi
     * @export
     * @param {any} target 
     * @param {any} key 
     * @param {any} source 
     */
    function defineReactive(target, key, source, souceKey) {
        souceKey = souceKey || key;
        Object.defineProperty(target, key, {
            get: function() {
                return source[souceKey];
            }
        });
    }

// scrollContent
var vueScrollContent = {
    name: 'scrollContent',
    render: function(_c) {
        var vm = this;
        var style = deepMerge(vm.state.style, {});
        style.height = vm.ops.height;
        if(vm.ops.padding) {
            style[vm.ops.paddPos] =  vm.ops.paddValue;
        }
        return _c(vm.ops.tag, {
            style: style,
            class: "scrollContent",
            props: vm.ops.props,
            attrs: vm.ops.attrs
        }, this.$slots.default);
    },
    props: {
        ops: {
            default: function() {
                /* istanbul ignore next */
                return {

                }
            }
        },
        state: {
            default: function() {
                /* istanbul ignore next */
                return {

                }
            }
        }
    }
}

// vueScrollPanel
var vueScrollPanel = {
    name: 'scrollPanel',
    render: function(_c) {
        var vm = this;
        return _c('div', {
            style: {
                overflow: 'scroll',
                marginRight: '-17px',
                height: 'calc(100% + 17px)'
            },
            class: "vueScrollPanel",
            on: {
                scroll: function(e) {
                    vm.$emit('scrolling', e);
                },
                wheel: function(e) {
                    vm.$emit('wheeling', e);
                }
            }
        }, this.$slots.default);
    }
}

var GCF = {
    // 
    scrollContent: {
        tag: 'div',
        padding: true,
        height: '100%',
        props: {
        },
        attrs: {
        }
    },
    // 
    vRail: {
        width: '5px',
        pos: 'left',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    vBar: {
        width: '5px',
        pos: 'left',
        background: '#4caf50',
        deltaY: 100,
        keepShow: false,
        opacity: 1,
    },
    // 
    hRail: {
        height: '5px',
        pos: 'bottom',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    hBar: {
        height: '5px',
        pos: 'bottom',
        background: '#4caf50',
        keepShow: false,
        opacity: 1
    }
}

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
    let vm = this;
    if(vm.$options.name === 'vueScroll') {
        let ops = deepMerge(GCF, {});
        vm.$options.propsData.ops = vm.$options.propsData.ops || {};
        Object.keys(vm.$options.propsData.ops).forEach(function(key) {
            defineReactive(
                vm.fOps,
                key,
                vm.$options.propsData.ops
            );
        });
        deepMerge(ops, vm.fOps);
        // to sync the rail and bar
        defineReactive(vm.fOps.vBar, 'pos', vm.fOps.vRail);
        defineReactive(vm.fOps.vBar, 'width', vm.fOps.vRail);
        defineReactive(vm.fOps.hBar, 'pos', vm.fOps.hRail);
        defineReactive(vm.fOps.hBar, 'height', vm.fOps.hRail);
        
        let prefix = "padding-";
        if(vm.fOps.scrollContent.padding) {
            Object.defineProperty(vm.fOps.scrollContent, 'paddPos',   {
                get() {
                    return prefix + vm.fOps.vRail.pos
                }
            });
            Object.defineProperty(vm.fOps.scrollContent, 'paddValue',  {
                get() {
                    return vm.fOps.vRail.width
                }
            });
        } 
        // defineReactive(vm.scrollContent.style, )
    } 
     
}
var LifeCycleMix = {
    created: function() {
        hackPropsData.call(this);
    }
}

// vuescroll core module

// import config
var vueScroll = {
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
            }
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
            }
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
            } else if (distance > 0) {
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
            var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "");
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
            return function() {
                var pre;
                var now;
                function move(e) {
                    now = e[coordinate];
                    var delta = now - pre;
                    vm['show' + bar]();
                    vm._scrollContent(delta, type);
                    pre = now;
                }
                function t(e) {
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
            function t(e) {
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

// import component
// import config
var scroll = {
    install: function(Vue) {
        /* istanbul ignore if */
        if(scroll.isInstalled) {
            console.warn("You should not install the vuescroll again!");
            return;
        }
        Vue.component(vRail.name, vRail);
        Vue.component(vScrollbar.name, vScrollbar);
        Vue.component(hRail.name, hRail);
        Vue.component(hScrollbar.name, hScrollbar);
        Vue.component(vueScrollContent.name, vueScrollContent);
        Vue.component(vueScrollPanel.name, vueScrollPanel);
        //vueScroll
        Vue.component(vueScroll.name, vueScroll);

        // registry the globe setting
        Vue.prototype.$vuescrollConfig = GCF;
        
        scroll.isInstalled = true;
    }
};

module.exports = scroll;
