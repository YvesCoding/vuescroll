/*
 * vuescroll 2.5 
 * @author:wangyi
 * @date 2018 1.15
 * inspired by slimscroll
 */
(function(global, factory) {
    typeof define === 'function' && define.amd ? define(factory) : typeof module !== 'undefined' ? module.exports = factory() : (global.Vue.use(factory()));
}
)(this, function() {

    var scroll = {
        install: function(Vue) {
            Vue.component(vScrollBar.name, vScrollBar);
            Vue.component(hScrollBar.name, hScrollBar);
            Vue.component(vueScrollPanel.name, vueScrollPanel);
            Vue.component(vueScrollCon.name, vueScrollCon);
            //vueScroll
            Vue.component(vueScroll.name, vueScroll);
        }
    };
    //scrollpanne
    var vueScrollPanel = {
        name: 'vueScrollPanel',
        render: function(createElement) {
            var vm = this;
            return createElement('div', {
                style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                },
                class: "vueScrollPanel",
                on: {
                    mouseenter: function() {
                        vm.$emit('showBar');
                    },
                    mouseleave: function() {
                        vm.$emit('hideBar');
                    }
                }
            }, this.$slots.default);
        },
        props: {
            id: {
                require: true
            }
        }
    }
    var vueScrollCon = {
        name: 'vueScrollCon',
        render: function(createElement) {
            var vm = this;
            //  console.log(this)
            return createElement('div', {
                style: vm.scrollContentStyle,
                class: "vueScrollContent",
            }, this.$slots.default);
        },
        props: {
            scrollContentStyle: {
                require: false,
                default: {
                    height: '100%'
                }
            }
        }
    }

    // vertical scrollBar
    var vScrollBar = {
        name: 'vScrollBar',
        render: function(createElement) {
            var vm = this;
            var style = {
                height: vm.state.height + 'px',
                width: vm.ops.width,
                position: 'absolute',
                background: vm.ops.background,
                top: vm.state.top + 'px',
                transition: 'opacity .5s',
                cursor: 'pointer',
                opacity: vm.state.opacity,
                userSelect: 'none'
            }
            if(vm.ops.pos == 'right') {
                style['right'] = 0;
            } else {
                style['left'] = 0;
            }
            return createElement('div', {
                style: style,
                class: "vScrollBar",
                on: {
                    mouseenter: function(e) {
                        vm.$emit('showVBar');
                    }
                }
            }, this.$slots.default);
        },
        props: {
            ops: {
                require: false,
                default: {
                    background: 'hsla(220,4%,58%,.3)',
                    width: '5px',
                    float: 'left',
                    opacity: 0,
                    pos:'left'
                }
            },
            state: {
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

    // horizontal scrollBar
    var hScrollBar = {
        name: 'hScrollBar',
        render: function(createElement) {
            var vm = this;
            var style = {
                height: vm.ops.height ,
                width: vm.state.width + 'px',
                position: 'absolute',
                background: vm.ops.background,
                left: vm.state.left + 'px',
                transition: 'opacity .5s',
                cursor: 'pointer',
                opacity: vm.state.opacity,
                userSelect: 'none'
            }
            if(vm.ops.pos == 'bottom') {
                style['bottom'] = 0;
            } else {
                style['top'] = 0;
            }
            return createElement('div', {
                style: style,
                class: "hScrollBar",
                on: {
                    mouseenter: function(e) {
                        vm.$emit('showHBar');
                    }
                }
            }, this.$slots.default);
        },
        props: {
            ops: {
                require: false,
                default: {
                    background: 'hsla(220,4%,58%,.3)',
                    height: '5px',
                    opacity: 0,
                    pos:'bottom'
                }
            },
            state: {
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
    var vueScroll = {
        name: "vueScroll",
        class: 'vueScroll',
        data() {
            return {
                scrollPanel: {
                    el: "",
                    ops: {
                    }
                },
                scrollContent: {
                    el: "",
                    ops: {
                    }
                },
                vScrollBar: {
                    el: "",
                    ops: {
                        background: 'hsla(220,4%,58%,.3)',
                        width: '5px',
                        pos:'',
                        deltaY: 30,
                        keepShow: false
                    },
                    state: {
                        top: 0,
                        height: 0,
                        opacity: 0
                    },
                    minBarHeight: 35,
                    innerDeltaY: 0
                },
                hScrollBar: {
                    el: "",
                    ops: {
                        background: 'hsla(220,4%,58%,.3)',
                        height: '5px',
                        deltaX: 30,
                        pos:'',
                        keepShow: false
                    },
                    state: {
                        left: 0,
                        width: 0,
                        opacity: 0
                    },
                    minBarWidth: 35,
                    innerDeltaX: 0
                },
                listeners: [],
                mousedown: false,
                isMouseLeavePanel: true
            }
        },
        render: function(createElement) {
            var vm = this;
            return createElement('div', {
                style: {
                    position: 'relative',
                    height: '100%',
                    width: '100%'
                },
                on: {
                    wheel: vm.wheel,
                    mouseenter: function() {
                        vm.isMouseLeavePanel = false;
                        vm.showBar();
                    },
                    mouseleave: function() {
                        vm.isMouseLeavePanel = true;
                        vm.hideBar();
                    }
                },
            }, [createElement('vueScrollPanel', {
                ref: 'vueScrollPanel',
                on: {
                    showBar: vm.showBar,
                    hideBar: vm.hideBar
                }
            }, [createElement('vueScrollCon', {
                props: {
                    scrollContentStyle: vm.scrollContent.ops
                },
                ref: 'vueScrollCon'
            }, vm.$slots.default)]), createElement('vScrollBar', {
                props: {
                    ops: vm.vScrollBar.ops,
                    state: vm.vScrollBar.state
                },
                ref: 'vScrollBar',
                on: {
                    showVBar: vm.showVBar,
                    hideVBar: vm.hideVBar
                }
            }), createElement('hScrollBar', {
                props: {
                    ops: vm.hScrollBar.ops,
                    state: vm.hScrollBar.state
                },
                ref: 'hScrollBar',
                on: {
                    showHBar: vm.showHBar,
                    hideHBar: vm.hideHBar
                }
            })]);
        },
        mounted() {
            this.initEl();
            this.mergeAll();
            this.listenVBarDrag();
            this.listenHBarDrag();
            // showbar at init time
            this.showBar();
        },
        methods: {
            initEl() {
                this.scrollPanel.el = this.$refs['vueScrollPanel'] && this.$refs['vueScrollPanel'].$el;
                this.scrollContent.el = this.$refs['vueScrollCon'] && this.$refs['vueScrollCon'].$el;
                this.vScrollBar.el = this.$refs['vScrollBar'] && this.$refs['vScrollBar'].$el;
                this.hScrollBar.el = this.$refs['hScrollBar'] && this.$refs['hScrollBar'].$el;
            },
            mergeAll() {
                this.merge(this.ops.vBar, this.vScrollBar.ops);
                this.merge(this.ops.hBar, this.hScrollBar.ops);
                this.merge(this.scrollContentStyle, this.scrollContent.ops, false);
            },
            merge(from, to, check) {
                for (key in from) {
                    if (check === false) {
                        this.$set(to, key, from[key]);
                    } else if (Object.hasOwnProperty.call(to, key)) {
                        this.$set(to, key, from[key]);
                    }
                }
            },
            // get the bar height
            getVBarHeight({deltaY}) {
                var scrollPanelHeight = Math.floor(window.getComputedStyle(this.scrollPanel.el).getPropertyValue("height").replace('px', ""));
                var scrollPanelScrollHeight = Math.floor(this.scrollPanel.el.scrollHeight);
                // the last times that vertical scrollvar will scroll...
                var scrollTime = Math.ceil((scrollPanelScrollHeight - scrollPanelHeight) / Math.abs(deltaY));
                // choose the proper height for scrollbar
                var height = Math.max(scrollPanelHeight / (scrollPanelScrollHeight / scrollPanelHeight), this.vScrollBar.minBarHeight);
                if ((scrollPanelScrollHeight <= scrollPanelHeight)  || Math.abs(scrollPanelHeight - scrollPanelScrollHeight) <= this.accuracy) {
                    height = 0;
                    return height;
                }
                // the distance that scrollbar scrolls each time
                this.vScrollBar.innerDeltaY = (scrollPanelHeight - height) / scrollTime;
                return {
                    height,
                    scrollPanelHeight,
                    scrollPanelScrollHeight,
                    deltaY
                }
            },
            getHBarWidth({deltaX}) {
                var scrollPanelWidth = Math.floor(window.getComputedStyle(this.scrollPanel.el).getPropertyValue("width").replace('px', ""));
                var scrollPanelScrollWidth = Math.floor(this.scrollPanel.el.scrollWidth);
                // the last times that horizontal scrollbar will scroll...
                var scrollTime = Math.ceil((scrollPanelScrollWidth - scrollPanelWidth) / Math.abs(deltaX));
                // choose the proper width for scrollbar
                var width = Math.max(scrollPanelWidth / (scrollPanelScrollWidth / scrollPanelWidth), this.hScrollBar.minBarWidth);
                if ((scrollPanelScrollWidth <= scrollPanelWidth) || Math.abs(scrollPanelWidth - scrollPanelScrollWidth) <= this.accuracy) {
                    width = 0;
                    return width;
                }
                // the distance that scrollbar scrolls each time
                this.hScrollBar.innerDeltaX = (scrollPanelWidth - width) / scrollTime;
                return {
                    width,
                    scrollPanelWidth,
                    scrollPanelScrollWidth,
                    deltaX
                }
            },
            resizeVBarTop({height, scrollPanelHeight, scrollPanelScrollHeight, deltaY}) {
                // cacl the last height first
                var lastHeight = scrollPanelScrollHeight - scrollPanelHeight - this.scrollPanel.el.scrollTop;
                if(lastHeight < this.accuracy) {
                    lastHeight = 0;
                }
                var time = Math.abs(Math.ceil(lastHeight / deltaY));
                var top = scrollPanelHeight - (height + (time * this.vScrollBar.innerDeltaY));
                return top;
            },
            resizeHBarLeft({width, scrollPanelWidth, scrollPanelScrollWidth, deltaX}) {
                // cacl the last width first
                var lastWidth = scrollPanelScrollWidth - scrollPanelWidth - this.scrollPanel.el.scrollLeft;
                if(lastWidth < this.accuracy) {
                    lastWidth = 0;
                }
                var time = Math.abs(Math.ceil(lastWidth / deltaX));
                var left = scrollPanelWidth - (width + (time * this.hScrollBar.innerDeltaX));
                return left;
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
                var temp;
                var deltaY = {
                    deltaY: this.vScrollBar.ops.deltaY
                };
                if(!this.isMouseLeavePanel || this.vScrollBar.ops.keepShow){
                    if ((this.vScrollBar.state.height = temp = this.getVBarHeight(deltaY))) {
                        this.vScrollBar.state.top = this.resizeVBarTop(temp);
                        this.vScrollBar.state.height = temp.height;
                        this.vScrollBar.state.opacity = 1;
                    }
                }
            },
            // showHbar
            showHBar() {
                var temp;
                var deltaX = {
                    deltaX: this.hScrollBar.ops.deltaX
                };
                if(!this.isMouseLeavePanel || this.hScrollBar.ops.keepShow){
                    if ((this.hScrollBar.state.width = temp = this.getHBarWidth(deltaX))) {
                        this.hScrollBar.state.left = this.resizeHBarLeft(temp);
                        this.hScrollBar.state.width = temp.width;
                        this.hScrollBar.state.opacity = 1;
                    }
                }
            },
            // hideVbar
            hideVBar() {
                if(!this.vScrollBar.ops.keepShow) {
                    if (!this.mousedown && this.isMouseLeavePanel) {
                        this.vScrollBar.state.opacity = 0;
                    }
                }
            },
            // hideHbar
            hideHBar() {
                if(!this.hScrollBar.ops.keepShow) {
                    if (!this.mousedown && this.isMouseLeavePanel) {
                        this.hScrollBar.state.opacity = 0;
                    }
                }
            },
            // listen wheel scrolling
            wheel(e) {
                var vm = this;
                vm.showVBar();
                vm.scrollVBar(e.deltaY > 0 ? 1 : -1, 1);
                e.stopPropagation();
            },
            scrollVBar: function(pos, time) {
                // >0 scroll to down  <0 scroll to up
                 
                var top = this.vScrollBar.state.top;
                var scrollPanelHeight = window.getComputedStyle(this.scrollPanel.el).getPropertyValue("height").replace('px', "");
                var scrollPanelScrollHeight = this.scrollPanel.el.scrollHeight;
                var scrollPanelScrollTop = this.scrollPanel.el.scrollTop;
                var height = this.vScrollBar.state.height;
                var innerdeltaY = this.vScrollBar.innerDeltaY;
                var deltaY = this.vScrollBar.ops.deltaY;
                if (!((pos < 0 && top <= 0) || (scrollPanelHeight <= top + height && pos > 0) || (Math.abs(scrollPanelScrollHeight - scrollPanelHeight) < this.accuracy))) {
                    var Top = top + pos * innerdeltaY * time;
                    var ScrollTop = scrollPanelScrollTop + pos * deltaY * time;
                    if (pos < 0) {
                        // scroll ip
                        this.vScrollBar.state.top = Math.max(0, Top);
                        this.scrollPanel.el.scrollTop = Math.max(0, ScrollTop);
                    } else if (pos > 0) {
                        // scroll down
                        this.vScrollBar.state.top = Math.min(scrollPanelHeight - height, Top);
                        this.scrollPanel.el.scrollTop = Math.min(scrollPanelScrollHeight - scrollPanelHeight, ScrollTop);
                    }
                }
                var content = {};
                var bar = {};
                var process = "";
                content.residual = (scrollPanelScrollHeight - scrollPanelScrollTop - scrollPanelHeight);
                content.scrolled = scrollPanelScrollTop;
                bar.scrolled = this.vScrollBar.state.top;
                bar.residual = (scrollPanelHeight - this.vScrollBar.state.top - this.vScrollBar.state.height);
                bar.height = this.vScrollBar.state.height;
                process = bar.scrolled/(scrollPanelHeight - bar.height);
                bar.name = "vBar";
                content.name = "content";
                this.$emit('vscroll', bar, content, process);
            },
            scrollHBar: function(pos, time) {
                //  >0 scroll to right  <0 scroll to left
                
                var left = this.hScrollBar.state.left;
                var scrollPanelWidth = window.getComputedStyle(this.scrollPanel.el).getPropertyValue("width").replace('px', "");
                var scrollPanelScrollWidth = this.scrollPanel.el.scrollWidth;
                var scrollPanelScrollLeft = this.scrollPanel.el.scrollLeft;
                var width = this.hScrollBar.state.width;
                var innerdeltaX = this.hScrollBar.innerDeltaX;
                var deltaX = this.hScrollBar.ops.deltaX;
                if (!((pos < 0 && left <= 0) || (scrollPanelWidth <= left + width && pos > 0)  || (Math.abs(scrollPanelScrollWidth - scrollPanelWidth) < this.accuracy))) {
                    var Left = left + pos * innerdeltaX * time;
                    var ScrollLeft = scrollPanelScrollLeft + pos * deltaX * time;
                    if (pos < 0) {
                        // scroll left
                        this.hScrollBar.state.left = Math.max(0, Left);
                        this.scrollPanel.el.scrollLeft = Math.max(0, ScrollLeft);
                    } else if (pos > 0) {
                        // scroll right
                        this.hScrollBar.state.left = Math.min(scrollPanelWidth - width, Left);
                        this.scrollPanel.el.scrollLeft = Math.min(scrollPanelScrollWidth - scrollPanelWidth, ScrollLeft);
                    }
                }
                var content = {};
                var bar = {};
                var process = "";
                content.residual = (scrollPanelScrollWidth - scrollPanelScrollLeft - scrollPanelWidth);
                content.scrolled = scrollPanelScrollLeft;
                bar.scrolled = this.hScrollBar.state.left;
                bar.residual = (scrollPanelWidth - this.hScrollBar.state.left - this.hScrollBar.state.width);
                bar.width = this.hScrollBar.state.width;
                process = bar.scrolled/(scrollPanelWidth - bar.width);
                bar.name = "hBar";
                content.name = "content";
                this.$emit('hscroll', bar, content, process);
            },
            listenVBarDrag: function() {
                var vm = this;
                var y;
                var _y;
                function move(e) {
                    _y = e.pageY;
                    var _delta = _y - y;
                    vm.scrollVBar(_delta > 0 ? 1 : -1, Math.abs(_delta / vm.vScrollBar.innerDeltaY));
                    y = _y;
                }
                function t(e) {
                    //console.log(e);
                    vm.mousedown = true;
                    y = e.pageY;
                    vm.showVBar();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
                        vm.hideVBar();
                        document.removeEventListener('mousemove', move);
                    });
                }
                this.listeners.push({
                    dom: vm.vScrollBar.el,
                    event: t,
                    type: "mousedown"
                });
                vm.vScrollBar.el.addEventListener('mousedown', t);
            },
            listenHBarDrag: function() {
                var vm = this;
                var x;
                var _x;
                function move(e) {
                    _x = e.pageX;
                    var _delta = _x - x;
                    vm.scrollHBar(_delta > 0 ? 1 : -1, Math.abs(_delta / vm.hScrollBar.innerDeltaX));
                    x = _x;
                }
                function t(e) {
                    //console.log(e);
                    vm.mousedown = true;
                    x = e.pageX;
                    vm.showHBar();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
                        vm.hideHBar();
                        document.removeEventListener('mousemove', move);
                    });
                }
                this.listeners.push({
                    dom: vm.hScrollBar.el,
                    event: t,
                    type: "mousedown"
                });
                vm.hScrollBar.el.addEventListener('mousedown', t);
            }
        },
        props: {
            ops:{
                default: function () {
                    return {
                        vBar: {
                            
                        },
                        hBar: {

                        }
                    }
                }
            },
            scrollContentStyle: {
                default:function () {
                    return {

                    }
                }
            },
            accuracy: {
                default: 5
            } 
        }
    }

    function noop() {}

    return scroll;
});
