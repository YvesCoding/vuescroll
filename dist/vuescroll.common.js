/*
    * @name: vuescroll 3.6.6
    * @author: (c) 2018-2018 wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

var map = {
    vertical: {
        bar: {
            size: 'height',
            opsSize: 'width',
            posName: 'top',
            page: 'pageY',
            scroll: 'scrollTop',
            scrollSize: 'scrollHeight',
            offset: 'offsetHeight',
            client: 'clientY'
        },
        axis: 'Y'
    },
    horizontal: {
        bar: {
            size: 'width',
            opsSize: 'height',
            posName: 'left',
            page: 'pageX',
            scroll: 'scrollLeft',
            scrollSize: 'scrollWidth',
            offset: 'offsetWidth',
            client: 'clientX'
        },
        axis: 'X'
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @description deepCopy a object.
 * 
 * @param {any} source 
 * @returns 
 */
function deepCopy(source, target) {
    target = (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target || {};
    for (var key in source) {
        target[key] = _typeof(source[key]) === 'object' ? deepCopy(source[key], target[key] = {}) : source[key];
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
        if (_typeof(from[key]) === 'object') {
            if (!to[key]) {
                to[key] = {};
                deepCopy(from[key], to[key]);
            } else {
                deepMerge(from[key], to[key]);
            }
        } else {
            if (!to[key]) to[key] = from[key];
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
    var getter = null;
    if (!source[key] && typeof source !== 'function') {
        return;
    }
    souceKey = souceKey || key;
    if (typeof source === 'function') {
        getter = source;
    }
    Object.defineProperty(target, key, {
        get: getter || function () {
            return source[souceKey];
        },
        configurable: true
    });
}

var scrollBarWidth = void 0;

function getGutter() {
    /* istanbul ignore next */
    if (Vue.prototype.$isServer) return 0;
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;

    getGutter.isUsed = false;

    return scrollBarWidth;
}

// for macOs user, the gutter will be 0,
// so, we hide the system scrollbar
function hideSystemBar() {
    var styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.innerHTML = ".scrollPanel::-webkit-scrollbar{width:0;height:0}";
    document.getElementsByTagName('HEAD').item(0).appendChild(styleDom);
}

/**
 * @description render bar's style
 * @author wangyi
 * @export
 * @param {any} type vertical or horizontal
 * @param {any} posValue The position value
 */
function renderTransform(type, posValue) {
    return {
        transform: 'translate' + map[type].axis + '(' + posValue + '%)',
        msTransform: 'translate' + map[type].axis + '(' + posValue + '%)',
        webkitTransform: 'translate' + map[type].axis + '(' + posValue + '%)'
    };
}
/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */
function on(dom, eventName, hander) {
    var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    dom.addEventListener(eventName, hander, capture);
}
/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */
function off(dom, eventName, hander) {
    var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    dom.removeEventListener(eventName, hander, capture);
}
/**
 * Calculate the easing pattern
 * @link https://github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js
 * modified by wangyi7099
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
function easingPattern(easing, time) {
    var pattern = null;
    /* istanbul ignore next */
    {
        // Default Easing Patterns
        if (easing === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
        if (easing === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
        if (easing === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
        if (easing === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
        if (easing === 'easeOutCubic') pattern = --time * time * time + 1; // decelerating to zero velocity
        if (easing === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
        if (easing === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
        if (easing === 'easeOutQuart') pattern = 1 - --time * time * time * time; // decelerating to zero velocity
        if (easing === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
        if (easing === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
        if (easing === 'easeOutQuint') pattern = 1 + --time * time * time * time * time; // decelerating to zero velocity
        if (easing === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
    }
    return pattern || time; // no easing, no acceleration
}

/**
 * 
 * 
 * @export
 * @param {any} elm 
 * @param {any} deltaX 
 * @param {any} deltaY 
 * @param {any} speed 
 * @param {any} easing 
 */
function goScrolling(elm, deltaX, deltaY, speed, easing) {
    var start = null;
    var positionX = null;
    var positionY = null;
    var startLocationY = elm['scrollTop'];
    var startLocationX = elm['scrollLeft'];
    /**
     * keep the limit of scroll delta.
     */
    /* istanbul ignore next */
    {
        if (startLocationY + deltaY < 0) {
            deltaY = -startLocationY;
        }
        if (startLocationY + deltaY > elm['scrollHeight']) {
            deltaY = elm['scrollHeight'] - startLocationY;
        }
        if (startLocationX + deltaX < 0) {
            deltaX = -startLocationX;
        }
        if (startLocationX + deltaX > elm['scrollWidth']) {
            deltaX = elm['scrollWidth'] - startLocationX;
        }
    }
    var loopScroll = function loopScroll(timeStamp) {
        if (!start) {
            start = timeStamp;
        }
        var deltaTime = timeStamp - start;
        var percentage = deltaTime / speed > 1 ? 1 : deltaTime / speed;
        positionX = startLocationX + deltaX * easingPattern(easing, percentage);
        positionY = startLocationY + deltaY * easingPattern(easing, percentage);
        if (Math.abs(positionY - startLocationY) <= Math.abs(deltaY) || Math.abs(positionX - startLocationX) <= Math.abs(deltaX)) {
            // set scrollTop or scrollLeft
            elm['scrollTop'] = Math.floor(positionY);
            elm['scrollLeft'] = Math.floor(positionX);
            if (percentage < 1) {
                requestAnimationFrame(loopScroll);
            }
        }
    };
    requestAnimationFrame(loopScroll);
}

var GCF = {
    // vuescroll
    vuescroll: {
        style: {
            position: 'relative',
            height: '100%',
            width: '100%',
            padding: 0,
            overflow: 'hidden'
        },
        class: ['vueScroll']
    },
    scrollPanel: {
        initialScrollY: false,
        initialScrollX: false,
        speed: 300,
        easing: undefined
    },
    // 
    scrollContent: {
        tag: 'div',
        padding: true,
        height: '100%',
        props: {},
        attrs: {}
    },
    // 
    vRail: {
        width: '5px',
        pos: 'right',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    vBar: {
        width: '5px',
        pos: 'right',
        background: '#4caf50',
        deltaY: 100,
        keepShow: false,
        opacity: 1
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
};

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
    var vm = this;
    if (vm.$options.name === 'vueScroll') {
        var ops = deepMerge(GCF, {});
        vm.$options.propsData.ops = vm.$options.propsData.ops || {};
        Object.keys(vm.$options.propsData.ops).forEach(function (key) {
            {
                defineReactive(vm.mergedOptions, key, vm.$options.propsData.ops);
            }
        });
        // from ops to mergedOptions
        deepMerge(ops, vm.mergedOptions);
        // to sync the rail and bar
        defineReactive(vm.mergedOptions.vBar, 'pos', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.vBar, 'width', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.hBar, 'pos', vm.mergedOptions.hRail);
        defineReactive(vm.mergedOptions.hBar, 'height', vm.mergedOptions.hRail);

        var prefix = "padding-";
        if (vm.mergedOptions.scrollContent.padding) {
            defineReactive(vm.mergedOptions.scrollContent, 'paddPos', function () {
                return prefix + vm.mergedOptions.vRail.pos;
            });
            defineReactive(vm.mergedOptions.scrollContent, 'paddValue', function () {
                return vm.mergedOptions.vRail.width;
            });
        }
    }
}
var LifeCycleMix = {
    created: function created() {
        hackPropsData.call(this);
    }
};

/**
 * extract an exact number from given params
 * @param {any} distance 
 * @param {any} scroll 
 * @param {any} el 
 * @returns 
 */
function extractScrollDistance(distance, scroll, el) {
    var number = void 0;
    if (!(number = /(\d+)%$/.exec(distance))) {
        number = distance;
    } else {
        number = number[1];
        number = el[scroll] * number / 100;
    }
    return number;
}

var vuescrollApi = {
    methods: {
        scrollTo: function scrollTo(pos) {
            if (typeof pos.x === 'undefined') {
                pos.x = this.$refs['scrollPanel'].$el.scrollLeft;
            } else {
                pos.x = extractScrollDistance(pos.x, 'scrollWidth', this.scrollPanelElm);
            }
            if (typeof pos.y === 'undefined') {
                pos.y = this.$refs['scrollPanel'].$el.scrollTop;
            } else {
                pos.y = extractScrollDistance(pos.y, 'scrollHeight', this.scrollPanelElm);
            }
            var x = pos.x;
            var y = pos.y;
            goScrolling(this.$refs['scrollPanel'].$el, x - this.$refs['scrollPanel'].$el.scrollLeft, y - this.$refs['scrollPanel'].$el.scrollTop, this.mergedOptions.scrollPanel.speed, this.mergedOptions.scrollPanel.easing);
        },
        forceUpdate: function forceUpdate() {
            var _this = this;

            this.$forceUpdate();
            Object.keys(this.$refs).forEach(function (ref) {
                _this.$refs[ref].$forceUpdate();
            });
        }
    }
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bar = {
    name: "bar",
    computed: {
        bar: function bar() {
            return map[this.type].bar;
        },
        parent: function parent() {
            /* istanbul ignore next */
            return this.$parent.$refs;
        }
    },
    render: function render(h) {
        var _extends2;

        var style = _extends((_extends2 = {}, _defineProperty(_extends2, this.bar.posName, 0), _defineProperty(_extends2, this.ops.pos, 0), _defineProperty(_extends2, this.bar.size, this.state.size), _defineProperty(_extends2, this.bar.opsSize, this.ops[this.bar.opsSize]), _defineProperty(_extends2, 'background', this.ops.background), _defineProperty(_extends2, 'opacity', this.state.opacity), _defineProperty(_extends2, 'cursor', 'pointer'), _defineProperty(_extends2, 'position', 'absolute'), _defineProperty(_extends2, 'borderRadius', '4px'), _defineProperty(_extends2, 'transition', 'opacity .5s'), _defineProperty(_extends2, 'cursor', 'pointer'), _defineProperty(_extends2, 'userSelect', 'none'), _extends2), renderTransform(this.type, this.state.posValue));
        var data = {
            style: style,
            class: this.type + 'Scrollbar',
            on: {
                mousedown: this.handleMousedown
            }
        };
        return h('div', data);
    },

    methods: {
        handleMousedown: function handleMousedown(e) {
            e.stopPropagation();
            this.axisStartPos = e[this.bar.client] - this.$el.getBoundingClientRect()[this.bar.posName];
            // tell parent that the mouse has been down.
            this.$emit("setMousedown", true);
            on(document, 'mousemove', this.handleMouseMove);
            on(document, 'mouseup', this.handleMouseUp);
        },
        handleMouseMove: function handleMouseMove(e) {
            /**
             * I really don't have an
             * idea to test mousemove...
             */

            /* istanbul ignore next */
            if (!this.axisStartPos) {
                return;
            }
            /* istanbul ignore next */
            {
                var delta = e[this.bar.client] - this.parent[this.type + 'Rail'].$el.getBoundingClientRect()[this.bar.posName];
                var percent = (delta - this.axisStartPos) / this.parent[this.type + 'Rail'].$el[this.bar.offset];
                this.parent['scrollPanel'].$el[this.bar.scroll] = this.parent['scrollPanel'].$el[this.bar.scrollSize] * percent;
            }
        },
        handleMouseUp: function handleMouseUp() {
            this.$emit("setMousedown", false);
            this.$parent.hideBar();
            this.axisStartPos = 0;
            off(document, 'mousemove', this.handleMouseMove);
            off(document, 'mouseup', this.handleMouseUp);
        }
    },
    props: {
        ops: {
            type: Object,
            required: true
        },
        state: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }
};

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rail = {
    name: "rail",
    computed: {
        bar: function bar() {
            return map[this.type].bar;
        },
        parentRef: function parentRef() {
            return this.$parent.$refs;
        }
    },
    methods: {
        handleClickTrack: function handleClickTrack(e) {
            var page = this.bar.page;
            var barOffset = this.parentRef[this.type + 'Bar'].$el[this.bar.offset];
            var percent = (e[page] - e.target.getBoundingClientRect()[this.bar.posName] - barOffset / 2) / e.target[this.bar.offset];
            var pos = this.parentRef['scrollPanel'].$el[this.bar.scrollSize] * percent;
            this.$parent.scrollTo(_defineProperty$1({}, map[this.type].axis.toLowerCase(), pos));
        }
    },
    render: function render(h) {
        var _style;

        var vm = this;
        var style = (_style = {}, _defineProperty$1(_style, vm.bar.posName, 0), _defineProperty$1(_style, vm.ops.pos, 0), _defineProperty$1(_style, vm.bar.size, '100%'), _defineProperty$1(_style, vm.bar.opsSize, vm.ops[vm.bar.opsSize]), _defineProperty$1(_style, 'background', vm.ops.background), _defineProperty$1(_style, 'opacity', vm.ops.opacity), _defineProperty$1(_style, 'position', 'absolute'), _defineProperty$1(_style, 'cursor', 'pointer'), _defineProperty$1(_style, 'borderRadius', '4px'), _style);
        var data = {
            style: style,
            class: this.type + 'Rail',
            on: {
                click: this.handleClickTrack
            }
        };
        return h('div', data);
    },

    props: {
        type: {
            required: true,
            type: String
        },
        ops: {
            required: true,
            type: Object
        },
        state: {
            required: true,
            type: Object
        }
    }
};

// scrollContent
var scrollContent = {
    name: 'scrollContent',
    render: function render(_c) {
        var vm = this;
        var style = deepMerge(vm.state.style, {});
        style.height = vm.ops.height;
        if (vm.ops.padding) {
            style[vm.ops.paddPos] = vm.ops.paddValue;
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
            default: function _default() {
                /* istanbul ignore next */
                return {};
            }
        },
        state: {
            default: function _default() {
                /* istanbul ignore next */
                return {};
            }
        }
    }
};

// vueScrollPanel
var scrollPanel = {
    name: 'scrollPanel',
    methods: {
        updateInitialScroll: function updateInitialScroll() {
            var x = 0;
            var y = 0;
            if (this.ops.initialScrollX) {
                x = this.ops.initialScrollX;
            }
            if (this.ops.initialScrollY) {
                y = this.ops.initialScrollY;
            }
            this.$parent.scrollTo({
                x: x,
                y: y
            });
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.$nextTick(function () {
            if (!_this._isDestroyed) {
                _this.updateInitialScroll();
            }
        });
    },
    render: function render(h) {
        var gutter = getGutter();
        var style = {
            overflow: 'scroll'
        };
        if (gutter) {
            style.marginRight = -gutter + 'px';
            style.height = 'calc(100% + ' + gutter + 'px)';
            style.marginBottom = -gutter + 'px';
        } else /* istanbul ignore next */{
                style.height = '100%';
                if (!getGutter.isUsed) {
                    getGutter.isUsed = true;
                    hideSystemBar();
                }
            }
        var data = {
            style: style,
            class: ['scrollPanel']
        };
        return h(
            'div',
            data,
            [[this.$slots.default]]
        );
    },

    props: {
        ops: {
            default: function _default() {
                /* istanbul ignore next */
                return {};
            },

            validator: function validator(ops) {
                ops = ops || {};
                var rtn = true;
                var initialScrollY = ops['initialScrollY'];
                var initialScrollX = ops['initialScrollX'];
                if (initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
                    console.error('[vuescroll]: The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.');
                    rtn = false;
                }
                if (initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
                    console.error('[vuescroll]: The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.');
                    rtn = false;
                }
                return rtn;
            }
        }
    }
};

// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
// import lefrCycle
// import global config
// import api
// import necessary components
var vuescroll = {
    name: "vueScroll",
    mixins: [LifeCycleMix, vuescrollApi],
    data: function data() {
        return {
            scrollPanel: {
                el: ""
            },
            scrollContent: {},
            vRail: {
                state: {}
            },
            hRail: {
                state: {}
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
                scrollPanel: {},
                scrollContent: {},
                vRail: {},
                vBar: {},
                hRail: {},
                hBar: {}
            }
        };
    },
    render: function render(h) {
        var vm = this;
        // vuescroll data
        var vuescrollData = {
            style: GCF.vuescroll.style,
            class: GCF.vuescroll.class,
            on: {
                mouseenter: function mouseenter() {
                    vm.pointerLeave = false;
                    vm.showBar();
                    vm.update();
                },
                mouseleave: function mouseleave() {
                    vm.pointerLeave = true;
                    vm.hideBar();
                },
                mousemove: function mousemove() /* istanbul ignore next */{
                    vm.pointerLeave = false;
                    vm.showBar();
                    vm.update();
                }
            }
            // scrollPanel data
        };var scrollPanelData = {
            ref: "scrollPanel",
            nativeOn: {
                scroll: vm.handleScroll
            },
            props: {
                ops: vm.mergedOptions.scrollPanel
            }
            // scrollContent data
        };var scrollContentData = {
            props: {
                ops: vm.mergedOptions.scrollContent
            },
            ref: "scrollContent"
            // vBar data
        };var verticalBarData = {
            props: {
                type: "vertical",
                ops: vm.mergedOptions.vBar,
                state: vm.vBar.state
            },
            on: {
                setMousedown: this.setMousedown
            },
            ref: 'verticalBar'
            // vRail data
        };var verticalRailData = {
            props: {
                type: "vertical",
                ops: vm.mergedOptions.vRail,
                state: vm.vRail.state
            },
            ref: 'verticalRail'
            // hBar data
        };var horizontalBarData = {
            props: {
                type: "horizontal",
                ops: vm.mergedOptions.hBar,
                state: vm.hBar.state
            },
            on: {
                setMousedown: this.setMousedown
            },
            ref: 'horizontalBar'
            // hRail data
        };var horizontalRailData = {
            props: {
                type: "horizontal",
                ops: vm.mergedOptions.hRail,
                state: vm.hRail.state
            },
            ref: 'horizontalRail'
        };
        return h(
            'div',
            vuescrollData,
            [h(
                'scrollPanel',
                scrollPanelData,
                [h(
                    'scrollContent',
                    scrollContentData,
                    [[vm.$slots.default]]
                )]
            ), h('rail', verticalRailData), h('bar', verticalBarData), h('rail', horizontalRailData), h('bar', horizontalBarData)]
        );
    },

    computed: {
        scrollPanelElm: function scrollPanelElm() {
            return this.$refs.scrollPanel.$el;
        }
    },
    methods: {
        handleScroll: function handleScroll() {
            this.update();
        },
        triggerScrollEvent: function triggerScrollEvent() {
            var scrollPanel$$1 = this.scrollPanelElm;
            var vertical = {},
                horizontal = {};
            vertical['process'] = scrollPanel$$1.scrollTop / (scrollPanel$$1.scrollHeight - scrollPanel$$1.clientHeight);
            horizontal['process'] = scrollPanel$$1.scrollLeft / (scrollPanel$$1.scrollWidth - scrollPanel$$1.clientWidth);
            vertical['barSize'] = this.vBar.state.size;
            horizontal['barSize'] = this.hBar.state.size;
            this.$emit('handle-scroll', vertical, horizontal);
        },
        update: function update() {
            var heightPercentage = void 0,
                widthPercentage = void 0;
            var scrollPanel$$1 = this.scrollPanelElm;
            /* istanbul ignore if */
            if (!scrollPanel$$1) return;

            heightPercentage = scrollPanel$$1.clientHeight * 100 / (scrollPanel$$1.scrollHeight - this.accuracy);
            widthPercentage = scrollPanel$$1.clientWidth * 100 / (scrollPanel$$1.scrollWidth - this.accuracy);

            this.vBar.state.size = heightPercentage < 100 ? heightPercentage + '%' : '';
            this.hBar.state.size = widthPercentage < 100 ? widthPercentage + '%' : '';

            this.vBar.state.posValue = scrollPanel$$1.scrollTop * 100 / scrollPanel$$1.clientHeight;
            this.hBar.state.posValue = scrollPanel$$1.scrollLeft * 100 / scrollPanel$$1.clientWidth;

            // trigger scroll event
            this.triggerScrollEvent();
        },
        showBar: function showBar() {
            this.vBar.state.opacity = this.mergedOptions.vBar.opacity;
            this.hBar.state.opacity = this.mergedOptions.hBar.opacity;
        },
        hideBar: function hideBar() {
            // add mousedown condition 
            // to prevent from hiding bar while dragging the bar 
            if (!this.mergedOptions.vBar.keepShow && !this.mousedown && this.pointerLeave) {
                this.vBar.state.opacity = 0;
            }
            if (!this.mergedOptions.hBar.keepShow && !this.mousedown && this.pointerLeave) {
                this.hBar.state.opacity = 0;
            }
        },
        setMousedown: function setMousedown(val) {
            this.mousedown = val;
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.$nextTick(function () {
            if (!_this._isDestroyed) {
                _this.update();
                _this.showBar();
                _this.hideBar();
            }
        });
    },
    updated: function updated() {
        var _this2 = this;

        this.$nextTick(function () {
            if (!_this2._isDestroyed) {
                _this2.update();
                _this2.showBar();
                _this2.hideBar();
            }
        });
    },

    components: {
        bar: bar,
        rail: rail,
        scrollContent: scrollContent,
        scrollPanel: scrollPanel
    },
    props: {
        ops: {
            default: function _default() {
                /* istanbul ignore next */
                return {
                    scrollPanel: {},
                    scrollContent: {},
                    vRail: {},
                    vBar: {},
                    hRail: {},
                    hBar: {}
                };
            }
        },
        accuracy: {
            default: 0,
            validator: function validator(value) {
                if (value < 0) {
                    console.error('[vuescroll]:The prop `accury` must be 0 or higher!');
                    return false;
                }
                return true;
            }
        }
    }
};

// import component
// import config
var scroll = {
    install: function install(Vue$$1) {
        if (scroll.isInstalled) {
            console.warn("[vuescroll]:You should not install the vuescroll again!");
            return;
        }
        //vueScroll
        Vue$$1.component(vuescroll.name, vuescroll);

        // registry the globe setting
        Vue$$1.prototype.$vuescrollConfig = GCF;

        scroll.isInstalled = true;
    }
};

module.exports = scroll;
