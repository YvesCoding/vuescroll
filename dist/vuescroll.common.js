/*
    * @name: vuescroll 3.3.16
    * @author: (c) 2018-2018 wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x inspired by slimscroll
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
'use strict';

require('vue');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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
    souceKey = souceKey || key;
    Object.defineProperty(target, key, {
        get: function get$$1() {
            return source[souceKey];
        }
    });
}



/**
 * @description render bar's style
 * @author wangyi
 * @export
 * @param {any} type vertical or horizontal
 * @param {any} posValue The position value
 */

/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */

/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */

var GCF = {
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
    },
    // vuescroll
    vuescroll: {
        style: {
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        },
        class: ['vueScroll']
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
            defineReactive(vm.mergedOptions, key, vm.$options.propsData.ops);
        });
        deepMerge(ops, vm.mergedOptions);
        // to sync the rail and bar
        defineReactive(vm.mergedOptions.vBar, 'pos', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.vBar, 'width', vm.mergedOptions.vRail);
        defineReactive(vm.mergedOptions.hBar, 'pos', vm.mergedOptions.hRail);
        defineReactive(vm.mergedOptions.hBar, 'height', vm.mergedOptions.hRail);

        var prefix = "padding-";
        if (vm.mergedOptions.scrollContent.padding) {
            Object.defineProperty(vm.mergedOptions.scrollContent, 'paddPos', {
                get: function get() {
                    return prefix + vm.mergedOptions.vRail.pos;
                }
            });
            Object.defineProperty(vm.mergedOptions.scrollContent, 'paddValue', {
                get: function get() {
                    return vm.mergedOptions.vRail.width;
                }
            });
        }
        // defineReactive(vm.scrollContent.style, )
    }
}
var LifeCycleMix = {
    created: function created() {
        hackPropsData.call(this);
    }
};

// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
// import lefrCycle
// import global config
// import vuescroll map
// import necessary components
// import bar from "./vuescrollBar";
// import rail from "./vuescrollRail"
// import scrollContent from './vueScrollContent'
// import scrollPanel from './vueScrollPanel'
var vuescroll = {
    name: "vueScroll",
    mixins: [LifeCycleMix],
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
            mergedOptions: {
                scrollContent: {},
                vRail: {},
                vBar: {},
                hRail: {},
                hBar: {}
            }
        };
    },
    render: function render(h) {
        var vuescrollData = {
            style: gfc.vuescroll.style,
            class: gfc.vuescroll.class,
            on: {
                mouseenter: function mouseenter() {
                    this.showBar();
                },
                mouseleave: function mouseleave() {
                    this.hideBar();
                }
            }
            // scrollPanel data
        };var scrollPanelData = {
            ref: "scrollPanel",
            on: {
                scroll: this.handleScroll
            }
            // scrollContent data
        };var scrollContentData = {
            props: {
                ops: this.mergedOptions.scrollContent
            },
            ref: "scrollContent"
            // vBar data
        };var verticalBarData = {
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
                arg: 'mousedown',

                value: this.mousedown
            }
            // vRail data
        };var verticalRailData = {
            props: {
                type: "vertical",
                ops: this.mergedOptions.vRail,
                state: this.vRail.state
            }
            // hBar data
        };var horizontalBarData = {
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
                arg: 'mousedown',

                value: this.mousedown
            }
            // hRail data
        };var horizontalRailData = {
            props: {
                type: "horizontal",
                ops: this.mergedOptions.hRail,
                state: this.hRail.state
            }
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
                    [[this.$slots.default]]
                )]
            ), h('bar', verticalBarData), h('rail', verticalRailData), h('bar', horizontalBarData), h('rail', horizontalRailData)]
        );
    },

    computed: {
        scrollPanelRef: function scrollPanelRef() {
            return this.$refs.scrollPanel.$el;
        }
    },
    methods: {
        handleScroll: function handleScroll() {
            this.showBar();
        },
        update: function update() {
            var heightPercentage = void 0,
                widthPercentage = void 0;
            var scrollPanel = this.scrollPanelRef;
            if (!scrollPanel) return;

            heightPercentage = scrollPanel.clientHeight * 100 / (scrollPanel.scrollHeight - this.accuracy);
            widthPercentage = scrollPanel.clientWidth * 100 / (scrollPanel.scrollWidth - this.accuracy);

            this.vBar.state.size = heightPercentage < 100 ? heightPercentage + '%' : '';
            this.hBar.state.size = widthPercentage < 100 ? widthPercentage + '%' : '';

            this.vBar.state.posValue = scrollPanel.scrollTop * 100 / scrollPanel.clientHeight;
            this.hBar.state.posValue = scrollPanel.scrollLeft * 100 / scrollPanel.clientWidth;
        },
        showBar: function showBar() {
            this.update();
            this.vBar.state.opacity = this.mergedOptions.vBar.opacity;
            this.hBar.state.opacity = this.mergedOptions.hBar.opacity;
        },
        hideBar: function hideBar() {
            // add mousedown condition 
            // to prevent from hiding bar while dragging the bar 
            if (!this.mergedOptions.vBar.keepShow && !this.mousedown) {
                this.vBar.state.opacity = 0;
            }
            if (!this.mergedOptions.hBar.keepShow && !this.mousedown) {
                this.hBar.state.opacity = 0;
            }
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.$nextTick(function () {
            _this.showBar();
            _this.hideBar();
        });
    },
    updated: function updated() {
        var _this2 = this;

        this.$nextTick(function () {
            _this2.showBar();
            _this2.hideBar();
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
                return {
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
        /* istanbul ignore if */
        if (scroll.isInstalled) {
            console.warn("You should not install the vuescroll again!");
            return;
        }
        //vuescroll
        Vue$$1.component(vuescroll.name, vuescroll);

        // registry the globe setting
        Vue$$1.prototype.$vuescrollConfig = GCF;

        scroll.isInstalled = true;
    }
};

module.exports = scroll;
