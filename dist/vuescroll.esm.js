/*
    * @name: vuescroll 3.7.6
    * @author: (c) 2018-2018 wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
import Vue from 'vue';

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
            if (typeof to[key] === 'undefined') {
                to[key] = {};
                deepCopy(from[key], to[key]);
            } else {
                deepMerge(from[key], to[key]);
            }
        } else {
            if (typeof to[key] === 'undefined') to[key] = from[key];
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
var haveHideen = false;
function hideSystemBar() {
    if (haveHideen) {
        return;
    }
    haveHideen = true;
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

// detect content size change 
// https://github.com/wnr/element-resize-detector/blob/465fe68efbea85bb9fe22db2f68ebc7fde8bbcf5/src/detection-strategy/object.js
// modified by wangyi7099
function listenResize(element, funArr) {
    var OBJECT_STYLE = "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;";
    var style = window.getComputedStyle(element);
    var object = document.createElement("object");
    object.style.cssText = OBJECT_STYLE;
    object.tabIndex = -1;
    object.type = "text/html";
    object.onload = function () {
        funArr.forEach(function (func) {
            on(object.contentDocument.defaultView, 'resize', func);
        });
    };
    element.appendChild(object);
}

var GCF = {
    // vuescroll
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
        defineReactive(vm.mergedOptions.scrollContent, 'paddPos', function () {
            return prefix + vm.mergedOptions.vRail.pos;
        });
        defineReactive(vm.mergedOptions.scrollContent, 'paddValue', function () {
            return vm.mergedOptions.vRail.width;
        });
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
                var $ref = _this.$refs[ref];
                if ($ref._isVue) {
                    $ref.$forceUpdate();
                }
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
                var delta = e[this.bar.client] - this.parent[this.type + 'Rail'].getBoundingClientRect()[this.bar.posName];
                var percent = (delta - this.axisStartPos) / this.parent[this.type + 'Rail'][this.bar.offset];
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

function handleClickTrack(e, bar, parentRef, type, parent) {
    var page = bar.page;
    var barOffset = parentRef[type + 'Bar'].$el[bar.offset];
    var percent = (e[page] - e.target.getBoundingClientRect()[bar.posName] - barOffset / 2) / e.target[bar.offset];
    var pos = parentRef['scrollPanel'].$el[bar.scrollSize] * percent;
    parent.scrollTo(_defineProperty$1({}, map[type].axis.toLowerCase(), pos));
}

var rail = {
    name: "rail",
    functional: true,
    render: function render(h, _ref) {
        var _style;

        var parent = _ref.parent,
            props = _ref.props;

        var bar = map[props.type].bar;
        var parentRef = parent.$refs;
        var style = (_style = {}, _defineProperty$1(_style, bar.posName, 0), _defineProperty$1(_style, props.ops.pos, 0), _defineProperty$1(_style, bar.size, '100%'), _defineProperty$1(_style, bar.opsSize, props.ops[bar.opsSize]), _defineProperty$1(_style, 'background', props.ops.background), _defineProperty$1(_style, 'opacity', props.ops.opacity), _defineProperty$1(_style, 'position', 'absolute'), _defineProperty$1(_style, 'cursor', 'pointer'), _defineProperty$1(_style, 'borderRadius', '4px'), _style);
        var data = {
            style: style,
            class: props.type + 'Rail',
            ref: props.type + 'Rail',
            on: {
                click: function click(e) {
                    handleClickTrack(e, bar, parentRef, props.type, parent);
                }
            }
        };
        return h('div', data);
    }
};

// scrollContent
var scrollContent = {
    name: 'scrollContent',
    functional: true,
    render: function render(h, _ref) {
        var props = _ref.props,
            slots = _ref.slots;

        var style = deepMerge(props.state.style, {});
        style.position = 'relative';
        style.minHeight = "100%";
        if (props.ops.padding) {
            style[props.ops.paddPos] = props.ops.paddValue;
        }
        return h(props.ops.tag, {
            style: style,
            ref: 'scrollContent',
            class: "scrollContent",
            props: props.ops.props,
            attrs: props.ops.attrs
        }, slots().default);
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
        var data = {
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
/**
 * create a scrollPanel
 * 
 * @param {any} size 
 * @param {any} vm 
 * @returns 
 */
function createPanel(h, vm) {
    // scrollPanel data start
    var scrollPanelData = {
        ref: "scrollPanel",
        style: {},
        nativeOn: {
            scroll: vm.handleScroll
        },
        props: {
            ops: vm.mergedOptions.scrollPanel
        }
        // dynamic set overflow scroll
    };scrollPanelData.style['overflowY'] = vm.vBar.state.size ? 'scroll' : 'inherit';
    scrollPanelData.style['overflowX'] = vm.hBar.state.size ? 'scroll' : 'inherit';
    var gutter = getGutter();
    if (!getGutter.isUsed) {
        getGutter.isUsed = true;
    }
    hideSystemBar();
    scrollPanelData.style.height = '100%';

    return h(
        'scrollPanel',
        scrollPanelData,
        [createContent(h, vm)]
    );
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
    var scrollContentData = {
        props: {
            ops: vm.mergedOptions.scrollContent
        }
    };
    return h(
        'scrollContent',
        scrollContentData,
        [[vm.$slots.default]]
    );
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
    var railOptionType = type === 'vertical' ? 'vRail' : 'hRail';
    var barOptionType = type === 'vertical' ? 'vBar' : 'hBar';

    var railData = {
        props: {
            type: type,
            ops: vm.mergedOptions[railOptionType],
            state: vm[railOptionType].state
        }
    };
    if (vm[barOptionType].state.size) {
        return h('rail', railData);
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
    var barOptionType = type === 'vertical' ? 'vBar' : 'hBar';
    var barData = {
        props: {
            type: type,
            ops: vm.mergedOptions[barOptionType],
            state: vm[barOptionType].state
        },
        on: {
            setMousedown: vm.setMousedown
        },
        ref: type + 'Bar'
    };
    if (vm[barOptionType].state.size) {
        return h('bar', barData);
    }
    return null;
}

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
            timeoutId: 0,
            overflowY: true,
            overflowX: true,
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
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                padding: 0
            },
            class: 'vueScroll',
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
            // dynamic set overflow
        };vuescrollData.style['overflowY'] = vm.vBar.state.size ? 'hidden' : 'inherit';
        vuescrollData.style['overflowX'] = vm.hBar.state.size ? 'hidden' : 'inherit';

        return h(
            'div',
            vuescrollData,
            [createPanel(h, vm), createRail(h, vm, 'vertical'), createBar(h, vm, 'vertical'), createRail(h, vm, 'horizontal'), createBar(h, vm, 'horizontal')]
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
            if (this.pointerLeave) {
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                this.showAndDefferedHideBar();
            }
        },
        showAndDefferedHideBar: function showAndDefferedHideBar() {
            var _this = this;

            this.showBar();
            this.timeoutId = setTimeout(function () {
                _this.timeoutId = 0;
                _this.hideBar();
            }, 500);
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

            heightPercentage = scrollPanel$$1.clientHeight * 100 / scrollPanel$$1.scrollHeight;
            widthPercentage = scrollPanel$$1.clientWidth * 100 / scrollPanel$$1.scrollWidth;

            this.vBar.state.size = heightPercentage < 100 ? heightPercentage + '%' : 0;
            this.hBar.state.size = widthPercentage < 100 ? widthPercentage + '%' : 0;

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
        var _this2 = this;

        this.$nextTick(function () {
            if (!_this2._isDestroyed) {
                _this2.update();
                _this2.showBar();
                _this2.hideBar();
                /* istanbul ignore next */
                {
                    window.addEventListener("resize", function () {
                        _this2.update();
                        _this2.showBar();
                        _this2.hideBar();
                    }, false);
                    var funcArr = [function () {
                        if (_this2.timeoutId) {
                            clearTimeout(_this2.timeoutId);
                        }
                        _this2.showAndDefferedHideBar();
                        _this2.update();
                    }];
                    if (_this2.$listeners['handle-resize']) {
                        funcArr.push(_this2.$listeners['handle-resize']);
                    }
                    // registry resize event
                    var contentElm = _this2.$refs['scrollContent']._isVue ? _this2.$refs['scrollContent'].$el : _this2.$refs['scrollContent'];

                    listenResize(contentElm, funcArr);
                }
            }
        });
    },
    updated: function updated() {
        var _this3 = this;

        this.$nextTick(function () {
            if (!_this3._isDestroyed) {
                _this3.update();
                _this3.showBar();
                _this3.hideBar();
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

export default scroll;
