/*
    * Vuescroll v5.0.0
    * (c) 2018-2022 Yi(Yves) Wang
    * Released under the MIT License
    * Github: https://github.com/YvesCoding/vuescroll
    * Website: http://vuescrolljs.yvescoding.me/
    */
   
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.vuescroll = factory(global.Vue));
}(this, (function (vue) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function upperFirstChar(str) {
    return str.slice(0, 1).toUpperCase() + (str.slice(1) || '');
  }
  /* istanbul ignore next */

  var isServer = function isServer() {
    return typeof window === 'undefined';
  };
  function deepCopy(from, to, shallow) {
    if (shallow && isUndef(to)) {
      return from;
    }

    if (isArray(from)) {
      to = [];
      from.forEach(function (item, index) {
        to[index] = deepCopy(item, to[index]);
      });
    } else if (from) {
      if (!isPlainObj(from)) {
        return from;
      }

      to = {};

      for (var key in from) {
        to[key] = _typeof(from[key]) === 'object' ? deepCopy(from[key], to[key]) : from[key];
      }
    }

    return to;
  }
  function mergeObject(from, to, force, shallow) {
    if (shallow && isUndef(to)) {
      return from;
    }

    to = to || {};

    if (isArray(from)) {
      if (!isArray(to) && force) {
        to = [];
      }

      if (isArray(to)) {
        from.forEach(function (item, index) {
          to[index] = mergeObject(item, to[index], force, shallow);
        });
      }
    } else if (from) {
      if (!isPlainObj(from)) {
        if (force) {
          to = from;
        }
      } else {
        for (var key in from) {
          if (_typeof(from[key]) === 'object') {
            if (isUndef(to[key])) {
              to[key] = deepCopy(from[key], to[key], shallow);
            } else {
              mergeObject(from[key], to[key], force, shallow);
            }
          } else {
            if (isUndef(to[key]) || force) to[key] = from[key];
          }
        }
      }
    }

    return to;
  }
  function defineReactive(target, key, source, souceKey) {
    /* istanbul ignore if */
    if (!source[key] && typeof source !== 'function') {
      return;
    }

    souceKey = souceKey || key;
    Object.defineProperty(target, key, {
      get: function get() {
        return source[souceKey];
      },
      configurable: true
    });
  }
  function isIE() {
    /* istanbul ignore if */
    if (isServer()) return false;
    var agent = navigator.userAgent.toLowerCase();
    return agent.indexOf('msie') !== -1 || agent.indexOf('trident') !== -1 || agent.indexOf(' edge/') !== -1;
  }
  var isIos = function isIos() {
    /* istanbul ignore if */
    if (isServer()) return false;
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  };
  var isArray = function isArray(_) {
    return Array.isArray(_);
  };
  var isPlainObj = function isPlainObj(_) {
    return Object.prototype.toString.call(_) == '[object Object]';
  };
  var isUndef = function isUndef(_) {
    return typeof _ === 'undefined';
  }; // do nothing
  function getNumericValue(distance, size) {
    var number;

    if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
      number = distance - 0;
    } else {
      number = number[1] - 0;
      number = size * number / 100;
    }

    return number;
  }

  var log = {
    error: function error(msg) {
      console.error("[vuescroll] ".concat(msg));
    },
    warn: function warn(msg) {
      console.warn("[vuescroll] ".concat(msg));
    }
  };

  var warn = log.warn;
  var baseConfig = {
    // vuescroll
    vuescroll: {
      // vuescroll's size(height/width) should be a percent(100%)
      // or be a number that is equal to its parentNode's width or
      // height ?
      sizeStrategy: 'percent',

      /** Whether to detect dom resize or not */
      detectResize: true,

      /** Enable locking to the main axis if user moves only slightly on one of them at start */
      locking: true
    },
    scrollPanel: {
      // when component mounted.. it will automatically scrolls.
      initialScrollY: false,
      initialScrollX: false,
      // feat: #11
      scrollingX: true,
      scrollingY: true,
      speed: 300,
      easing: undefined,
      // Sometimes, the nativebar maybe on the left,
      // See https://github.com/YvesCoding/vuescroll/issues/64
      verticalNativeBarPos: 'right',
      maxHeight: undefined,
      maxWidth: undefined
    },
    //
    rail: {
      background: '#01a99a',
      opacity: 0,
      border: 'none',

      /** Rail's size(Height/Width) , default -> 6px */
      size: '6px',

      /** Specify rail's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
      specifyBorderRadius: false,

      /** Rail the distance from the two ends of the X axis and Y axis. **/
      gutterOfEnds: null,

      /** Rail the distance from the side of container. **/
      gutterOfSide: '2px',

      /** Whether to keep rail show or not, default -> false, event content height is not enough */
      keepShow: false
    },
    bar: {
      /** How long to hide bar after mouseleave, default -> 500 */
      showDelay: 500,

      /** Specify bar's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
      specifyBorderRadius: false,

      /** Whether to show bar on scrolling, default -> true */
      onlyShowBarOnScroll: true,

      /** Whether to keep show or not, default -> false */
      keepShow: false,

      /** Bar's background , default -> #00a650 */
      background: 'rgb(3, 185, 118)',

      /** Bar's opacity, default -> 1  */
      opacity: 1,

      /** bar's size(Height/Width) , default -> 6px */
      size: '6px',
      minSize: 0,
      disable: false
    },
    scrollButton: {
      enable: false,
      background: 'rgb(3, 185, 118)',
      opacity: 1,
      step: 180,
      mousedownStep: 30
    }
  };
  /**
   * validate the options
   * @export
   * @param {any} ops
   */

  function validateOps(ops) {
    var renderError = false;
    var scrollPanel = ops.scrollPanel;
    var _ops$bar = ops.bar,
        vBar = _ops$bar.vBar,
        hBar = _ops$bar.hBar;
    var _ops$rail = ops.rail,
        vRail = _ops$rail.vRail,
        hRail = _ops$rail.hRail; // validate scrollPanel

    var initialScrollY = scrollPanel['initialScrollY'];
    var initialScrollX = scrollPanel['initialScrollX'];

    if (initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
      warn('The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.');
    }

    if (initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
      warn('The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.');
    } // validate deprecated vBar/hBar vRail/hRail


    if (vBar || hBar || vRail || hRail) {
      warn('The options: vRail, hRail, vBar, hBar have been deprecated since v4.7.0,' + 'please use corresponing rail/bar instead!');
    }

    if (_extraValidate) {
      _extraValidate = [].concat(_extraValidate);

      _extraValidate.forEach(function (hasError) {
        if (hasError(ops)) {
          renderError = true;
        }
      });
    }

    return renderError;
  }
  var _extraValidate = null;
  var extendOpts = function extendOpts(extraOpts, extraValidate) {
    extraOpts = [].concat(extraOpts);
    extraOpts.forEach(function (opts) {
      mergeObject(opts, baseConfig);
    });
    _extraValidate = extraValidate;
  };

  /**
   * ZoomManager
   * Get the browser zoom ratio
   */
  var ZoomManager = /*#__PURE__*/function () {
    function ZoomManager() {
      var _this = this;

      _classCallCheck(this, ZoomManager);

      this.originPixelRatio = this.getRatio();
      this.lastPixelRatio = this.originPixelRatio;
      window.addEventListener('resize', function () {
        _this.lastPixelRatio = _this.getRatio();
      });
    }

    _createClass(ZoomManager, [{
      key: "getRatio",
      value: function getRatio() {
        var ratio = 0;
        var screen = window.screen;
        var ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
          ratio = window.devicePixelRatio;
        } else if (~ua.indexOf('msie')) {
          if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
          }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
          ratio = window.outerWidth / window.innerWidth;
        }

        if (ratio) {
          ratio = Math.round(ratio * 100);
        }

        return ratio;
      }
    }, {
      key: "getRatioBetweenPreAndCurrent",
      value: function getRatioBetweenPreAndCurrent() {
        return this.originPixelRatio / this.lastPixelRatio;
      }
    }]);

    return ZoomManager;
  }();

  var scrollBarWidth;
  var zoomManager;
  function getGutter() {
    /* istanbul ignore next */
    if (isServer()) return 0;

    if (!zoomManager) {
      zoomManager = new ZoomManager();
    }

    if (scrollBarWidth !== undefined) return scrollBarWidth * zoomManager.getRatioBetweenPreAndCurrent();
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
    scrollBarWidth = widthNoScroll - widthWithScroll; // multi the browser zoom

    if (!zoomManager) {
      zoomManager = new ZoomManager();
    }

    return scrollBarWidth * zoomManager.getRatioBetweenPreAndCurrent();
  }
  function eventCenter(dom, eventName, hander) {
    var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'on';
    type == 'on' ? dom.addEventListener(eventName, hander, capture) : dom.removeEventListener(eventName, hander, capture);
  }
  function isChildInParent(child, parent) {
    var flag = false;

    if (!child || !parent) {
      return flag;
    }

    while (child.parentNode !== parent && child.parentNode.nodeType !== 9 && !child.parentNode._isVuescroll) {
      child = child.parentNode;
    }

    if (child.parentNode == parent) {
      flag = true;
    }

    return flag;
  }
  function getPrefix(global) {
    var docStyle = document.documentElement.style;
    var engine;
    /* istanbul ignore if */

    if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
      engine = 'presto';
    }
    /* istanbul ignore next */
    else if ('MozAppearance' in docStyle) {
        engine = 'gecko';
      } else if ('WebkitAppearance' in docStyle) {
        engine = 'webkit';
      }
      /* istanbul ignore next */
      else if (typeof navigator.cpuClass === 'string') {
          engine = 'trident';
        }

    var vendorPrefix = {
      trident: 'ms',
      gecko: 'moz',
      webkit: 'webkit',
      presto: 'O'
    }[engine];
    return vendorPrefix;
  }
  function getComplitableStyle(property, value) {
    /* istanbul ignore if */
    if (isServer()) return false;
    var compatibleValue = "-".concat(getPrefix(window), "-").concat(value);
    var testElm = document.createElement('div');
    testElm.style[property] = compatibleValue;

    if (testElm.style[property] == compatibleValue) {
      return compatibleValue;
    }
    /* istanbul ignore next */


    return false;
  }
  /**
   * Insert children into user-passed slot at vnode level
   */

  function insertChildrenIntoSlot(parentVnodeFunc, childVNodeFunc) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var parentVnode = parentVnodeFunc();
    var childVNode = childVNodeFunc();
    /* istanbul ignore if */

    if (parentVnode && parentVnode.length > 1) {
      return function () {
        return [].concat(_toConsumableArray(parentVnode), _toConsumableArray(childVNode));
      };
    }

    var _getVnodeInfo = getVnodeInfo(parentVnode),
        ch = _getVnodeInfo.ch,
        tag = _getVnodeInfo.tag;

    var newCh = function newCh() {
      return [].concat(_toConsumableArray(ch), _toConsumableArray(childVNode));
    };

    return vue.h(tag, mergeObject(data, parentVnode[0].props || {}, // merge our props and the props that user passed to custom component.
    false, true), {
      "default": newCh
    });
  }
  /**
   *  Get the info of a vnode,
   * vnode must be parentVnode
   */

  function getVnodeInfo(vnode) {
    /* istanbul ignore if */
    if (!vnode || vnode.length > 1) return {};
    var firstVnode = vnode[0] ? vnode[0] : vnode;
    var ch;
    var tag;
    ch = firstVnode.children || [];
    tag = firstVnode.type;
    return {
      ch: ch,
      tag: tag
    };
  }
  /**
   * Get the vuescroll instance instead of
   * user pass component like slot.
   */

  function getRealParent(ctx) {
    var parent = ctx.$parent;

    if (!parent.$data._isVuescrollRoot && parent) {
      parent = parent.$parent;
    }

    return parent;
  }
  function createStyle(styleId, cssText) {
    /* istanbul ignore if */
    if (isServer() || document.getElementById(styleId)) {
      return;
    }

    var head = document.head || doc.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.id = styleId;
    style.type = 'text/css';
    /* istanbul ignore if */

    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }

    head.appendChild(style);
  } // Hide the ios native scrollbar.

  function createHideBarStyle() {
    /* istanbul ignore next */
    {
      var cssText = ".__hidebar::-webkit-scrollbar {\n      width: 0;\n      height: 0;\n    }";
      createStyle('vuescroll-hide-ios-bar', cssText);
    }
  } // create slide mode style
  /**
   * Get the children of parent those are in viewport
   */

  function getCurrentViewportDom(parent, container) {
    var children = parent.children;
    var domFragment = [];

    var isCurrentview = function isCurrentview(dom) {
      var _dom$getBoundingClien = dom.getBoundingClientRect(),
          left = _dom$getBoundingClien.left,
          top = _dom$getBoundingClien.top,
          width = _dom$getBoundingClien.width,
          height = _dom$getBoundingClien.height;

      var _container$getBoundin = container.getBoundingClientRect(),
          parentLeft = _container$getBoundin.left,
          parentTop = _container$getBoundin.top,
          parentHeight = _container$getBoundin.height,
          parentWidth = _container$getBoundin.width;

      if (left - parentLeft + width > 0 && left - parentLeft < parentWidth && top - parentTop + height > 0 && top - parentTop < parentHeight) {
        return true;
      }

      return false;
    };

    for (var i = 0; i < children.length; i++) {
      var dom = children.item(i);

      if (isCurrentview(dom) && !dom.isResizeElm) {
        domFragment.push(dom);
      }
    }

    return domFragment;
  }

  var scrollMap = {
    vertical: {
      size: 'height',
      opsSize: 'width',
      posName: 'top',
      opposName: 'bottom',
      sidePosName: 'right',
      page: 'pageY',
      scroll: 'scrollTop',
      scrollSize: 'scrollHeight',
      offset: 'offsetHeight',
      client: 'clientY',
      axis: 'Y',
      scrollButton: {
        start: 'top',
        end: 'bottom'
      }
    },
    horizontal: {
      size: 'width',
      opsSize: 'height',
      posName: 'left',
      opposName: 'right',
      sidePosName: 'bottom',
      page: 'pageX',
      scroll: 'scrollLeft',
      scrollSize: 'scrollWidth',
      offset: 'offsetWidth',
      client: 'clientX',
      axis: 'X',
      scrollButton: {
        start: 'left',
        end: 'right'
      }
    }
  };

  var TouchManager = /*#__PURE__*/function () {
    function TouchManager() {
      _classCallCheck(this, TouchManager);
    }

    _createClass(TouchManager, [{
      key: "getEventObject",
      value: function getEventObject(originEvent) {
        return this.touchObject ? this.isTouch ? originEvent.touches : [originEvent] : null;
      }
    }, {
      key: "getTouchObject",
      value: function getTouchObject()
      /* istanbul ignore next */
      {
        if (isServer()) return null;
        this.isTouch = false;
        var agent = navigator.userAgent,
            platform = navigator.platform,
            touchObject = {};
        touchObject.touch = !!('ontouchstart' in window && !window.opera || 'msmaxtouchpoints' in window.navigator || 'maxtouchpoints' in window.navigator || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
        touchObject.nonDeskTouch = touchObject.touch && !/win32/i.test(platform) || touchObject.touch && /win32/i.test(platform) && /mobile/i.test(agent);
        touchObject.eventType = 'onmousedown' in window && !touchObject.nonDeskTouch ? 'mouse' : 'ontouchstart' in window ? 'touch' : 'msmaxtouchpoints' in window.navigator || navigator.msMaxTouchPoints > 0 ? 'mstouchpoints' : 'maxtouchpoints' in window.navigator || navigator.maxTouchPoints > 0 ? 'touchpoints' : 'mouse';

        switch (touchObject.eventType) {
          case 'mouse':
            touchObject.touchstart = 'mousedown';
            touchObject.touchend = 'mouseup';
            touchObject.touchmove = 'mousemove';
            touchObject.touchenter = 'mouseenter';
            touchObject.touchmove = 'mousemove';
            touchObject.touchleave = 'mouseleave';
            break;

          case 'touch':
            touchObject.touchstart = 'touchstart';
            touchObject.touchend = 'touchend';
            touchObject.touchmove = 'touchmove';
            touchObject.touchcancel = 'touchcancel';
            touchObject.touchenter = 'touchstart';
            touchObject.touchmove = 'touchmove';
            touchObject.touchleave = 'touchend';
            this.isTouch = true;
            break;

          case 'mstouchpoints':
            touchObject.touchstart = 'MSPointerDown';
            touchObject.touchend = 'MSPointerUp';
            touchObject.touchmove = 'MSPointerMove';
            touchObject.touchcancel = 'MSPointerCancel';
            touchObject.touchenter = 'MSPointerDown';
            touchObject.touchmove = 'MSPointerMove';
            touchObject.touchleave = 'MSPointerUp';
            break;

          case 'touchpoints':
            touchObject.touchstart = 'pointerdown';
            touchObject.touchend = 'pointerup';
            touchObject.touchmove = 'pointermove';
            touchObject.touchcancel = 'pointercancel';
            touchObject.touchenter = 'pointerdown';
            touchObject.touchmove = 'pointermove';
            touchObject.touchleave = 'pointerup';
            break;
        }

        Object.keys(touchObject).forEach(function (key) {
          if (key !== 'touch' && key.startsWith('touch')) {
            touchObject['_' + key] = touchObject[key];
            touchObject[key] = 'on' + upperFirstChar(touchObject[key]);
          }
        });
        return this.touchObject = touchObject;
      }
    }]);

    return TouchManager;
  }();

  /**
   *  Compatible to scroller's animation function
   */
  function createEasingFunction(easing, easingPattern) {
    return function (time) {
      return easingPattern(easing, time);
    };
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

  function requestAnimationFrame(global) {
    // Check for request animation Frame support
    var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
    var isNative = !!requestFrame;

    if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
      isNative = false;
    }

    if (isNative) {
      return function (callback, root) {
        requestFrame(callback, root);
      };
    }

    var TARGET_FPS = 60;
    var requests = {};
    var rafHandle = 1;
    var intervalHandle = null;
    var lastActive = +new Date();
    return function (callback) {
      var callbackHandle = rafHandle++; // Store callback

      requests[callbackHandle] = callback; // Create timeout at first request

      if (intervalHandle === null) {
        intervalHandle = setInterval(function () {
          var time = +new Date();
          var currentRequests = requests; // Reset data structure before executing callbacks

          requests = {};

          for (var key in currentRequests) {
            if (currentRequests.hasOwnProperty(key)) {
              currentRequests[key](time);
              lastActive = time;
            }
          } // Disable the timeout when nothing happens for a certain
          // period of time


          if (time - lastActive > 2500) {
            clearInterval(intervalHandle);
            intervalHandle = null;
          }
        }, 1000 / TARGET_FPS);
      }

      return callbackHandle;
    };
  }

  function noop() {
    return true;
  }
  /* istanbul ignore next */


  var now = Date.now || function () {
    return new Date().getTime();
  };

  var ScrollControl = /*#__PURE__*/function () {
    function ScrollControl() {
      _classCallCheck(this, ScrollControl);

      this.init();
      this.isRunning = false;
    }

    _createClass(ScrollControl, [{
      key: "pause",
      value: function pause() {
        /* istanbul ignore if */
        if (!this.isRunning) return;
        this.isPaused = true;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.isStopped = true;
      }
    }, {
      key: "continue",
      value: function _continue() {
        /* istanbul ignore if */
        if (!this.isPaused) return;
        this.isPaused = false;
        this.ts = now() - this.percent * this.spd;
        this.execScroll();
      }
    }, {
      key: "startScroll",
      value: function startScroll(st, ed, spd) {
        var stepCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
        var completeCb = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : noop;
        var vertifyCb = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : noop;
        var easingMethod = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : noop;
        var df = ed - st;
        var dir = df > 0 ? -1 : 1;
        var nt = now();

        if (!this.isRunning) {
          this.init();
        }

        if (dir != this.dir || nt - this.ts > 200) {
          this.ts = nt;
          this.dir = dir;
          this.st = st;
          this.ed = ed;
          this.df = df;
        }
        /* istanbul ignore next */
        else {
            this.df += df;
          }

        this.spd = spd;
        this.completeCb = completeCb;
        this.vertifyCb = vertifyCb;
        this.stepCb = stepCb;
        this.easingMethod = easingMethod;
        if (!this.isRunning) this.execScroll();
      }
    }, {
      key: "execScroll",
      value: function execScroll() {
        var _this = this;

        if (!this.df) return;
        var percent = this.percent || 0;
        this.percent = 0;
        this.isRunning = true;

        var loop = function loop() {
          /* istanbul ignore if */
          if (!_this.isRunning || !_this.vertifyCb(percent) || _this.isStopped) {
            _this.isRunning = false;
            return;
          }

          percent = (now() - _this.ts) / _this.spd;

          if (_this.isPaused) {
            _this.percent = percent;
            _this.isRunning = false;
            return;
          }

          if (percent < 1) {
            var value = _this.st + _this.df * _this.easingMethod(percent);

            _this.stepCb(value);

            _this.ref(loop);
          } else {
            // trigger complete
            _this.stepCb(_this.st + _this.df);

            _this.completeCb();

            _this.isRunning = false;
          }
        };

        this.ref(loop);
      }
    }, {
      key: "init",
      value: function init() {
        this.st = 0;
        this.ed = 0;
        this.df = 0;
        this.spd = 0;
        this.ts = 0;
        this.dir = 0;
        this.ref = requestAnimationFrame(window);
        this.isPaused = false;
        this.isStopped = false;
      }
    }]);

    return ScrollControl;
  }();

  var warn$1 = log.warn;
  function scrollTo(elm, x, y) {
    var speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 300;
    var easing = arguments.length > 4 ? arguments[4] : undefined;
    var scrollingComplete = arguments.length > 5 ? arguments[5] : undefined;
    var scrollLeft, scrollTop, scrollHeight, scrollWidth, clientWidth, clientHeight;
    var _elm = elm,
        nodeType = _elm.nodeType;
    var scrollX = new ScrollControl();
    var scrollY = new ScrollControl();

    if (!nodeType) {
      warn$1('You must pass a dom for the first param, ' + 'for window scrolling, ' + 'you can pass document as the first param.');
      return;
    }

    if (nodeType == 9) {
      // document
      elm = elm.scrollingElement;
    }

    var _elm2 = elm;
    scrollLeft = _elm2.scrollLeft;
    scrollTop = _elm2.scrollTop;
    scrollHeight = _elm2.scrollHeight;
    scrollWidth = _elm2.scrollWidth;
    clientWidth = _elm2.clientWidth;
    clientHeight = _elm2.clientHeight;

    if (typeof x === 'undefined') {
      x = scrollLeft;
    } else {
      x = getNumericValue(x, scrollWidth - clientWidth);
    }

    if (typeof y === 'undefined') {
      y = scrollTop;
    } else {
      y = getNumericValue(y, scrollHeight - clientHeight);
    }

    var easingMethod = createEasingFunction(easing, easingPattern);
    scrollX.startScroll(scrollLeft, x, speed, function (dx) {
      elm.scrollLeft = dx;
    }, scrollingComplete, undefined, easingMethod);
    scrollY.startScroll(scrollTop, y, speed, function (dy) {
      elm.scrollTop = dy;
    }, scrollingComplete, undefined, easingMethod);
  }
  var api = {
    mounted: function mounted() {
      // registry scroll
      this.scrollX = new ScrollControl();
      this.scrollY = new ScrollControl();
    },
    methods: {
      nativeStop: function nativeStop() {
        this.scrollX.stop();
        this.scrollY.stop();
      },
      nativePause: function nativePause() {
        this.scrollX.pause();
        this.scrollY.pause();
      },
      nativeContinue: function nativeContinue() {
        this.scrollX["continue"]();
        this.scrollY["continue"]();
      },
      nativeScrollTo: function nativeScrollTo(x, y, speed, easing) {
        if (speed === false) ; else if (typeof speed === 'undefined') {
          speed = this.mergedOptions.scrollPanel.speed;
        }

        var elm = this.scrollPanelElm;
        var scrollTop = elm.scrollTop,
            scrollLeft = elm.scrollLeft,
            scrollWidth = elm.scrollWidth,
            clientWidth = elm.clientWidth,
            scrollHeight = elm.scrollHeight,
            clientHeight = elm.clientHeight;

        if (typeof x === 'undefined') {
          x = scrollLeft;
        } else {
          x = getNumericValue(x, scrollWidth - clientWidth);
        }

        if (typeof y === 'undefined') {
          y = scrollTop;
        } else {
          y = getNumericValue(y, scrollHeight - clientHeight);
        }

        if (speed) {
          easing = easing || this.mergedOptions.scrollPanel.easing;
          var easingMethod = createEasingFunction(easing, easingPattern);

          if (x != scrollLeft) {
            this.scrollX.startScroll(scrollLeft, x, speed, function (x) {
              elm.scrollLeft = x;
            }, this.scrollingComplete.bind(this), undefined, easingMethod);
          }

          if (y != scrollTop) {
            this.scrollY.startScroll(scrollTop, y, speed, function (y) {
              elm.scrollTop = y;
            }, this.scrollingComplete.bind(this), undefined, easingMethod);
          }
        } else {
          elm.scrollTop = y;
          elm.scrollLeft = x;
        }
      },
      getCurrentviewDomNative: function getCurrentviewDomNative() {
        var parent = this.scrollContentElm;
        var domFragment = getCurrentViewportDom(parent, this.$el);
        return domFragment;
      }
    }
  };

  var warn$2 = log.warn;
  var api$1 = {
    mounted: function mounted() {
      vsInstances[this.$.uid] = this;
    },
    beforeUnmount: function beforeUnmount() {
      /* istanbul ignore next */
      delete vsInstances[this.$.uid];
    },
    methods: {
      // public api
      scrollTo: function scrollTo(_ref, speed, easing) {
        var x = _ref.x,
            y = _ref.y;

        // istanbul ignore if
        if (speed === true || typeof speed == 'undefined') {
          speed = this.mergedOptions.scrollPanel.speed;
        }

        this.internalScrollTo(x, y, speed, easing);
      },
      scrollBy: function scrollBy(_ref2, speed, easing) {
        var _ref2$dx = _ref2.dx,
            dx = _ref2$dx === void 0 ? 0 : _ref2$dx,
            _ref2$dy = _ref2.dy,
            dy = _ref2$dy === void 0 ? 0 : _ref2$dy;

        var _this$getPosition = this.getPosition(),
            _this$getPosition$scr = _this$getPosition.scrollLeft,
            scrollLeft = _this$getPosition$scr === void 0 ? 0 : _this$getPosition$scr,
            _this$getPosition$scr2 = _this$getPosition.scrollTop,
            scrollTop = _this$getPosition$scr2 === void 0 ? 0 : _this$getPosition$scr2;

        if (dx) {
          scrollLeft += getNumericValue(dx, this.scrollPanelElm.scrollWidth - this.$el.clientWidth);
        }

        if (dy) {
          scrollTop += getNumericValue(dy, this.scrollPanelElm.scrollHeight - this.$el.clientHeight);
        }

        this.internalScrollTo(scrollLeft, scrollTop, speed, easing);
      },
      scrollIntoView: function scrollIntoView(elm) {
        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var parentElm = this.$el;

        if (typeof elm === 'string') {
          elm = parentElm.querySelector(elm);
        }

        if (!isChildInParent(elm, parentElm)) {
          warn$2('The element or selector you passed is not the element of Vuescroll, please pass the element that is in Vuescroll to scrollIntoView API. ');
          return;
        } // parent elm left, top


        var _this$$el$getBounding = this.$el.getBoundingClientRect(),
            left = _this$$el$getBounding.left,
            top = _this$$el$getBounding.top; // child elm left, top


        var _elm$getBoundingClien = elm.getBoundingClientRect(),
            childLeft = _elm$getBoundingClien.left,
            childTop = _elm$getBoundingClien.top;

        var diffX = left - childLeft;
        var diffY = top - childTop;
        this.scrollBy({
          dx: -diffX,
          dy: -diffY
        }, animate);
      },
      refresh: function refresh() {
        this.refreshInternalStatus(); // refresh again to keep status is correct

        this.$nextTick(this.refreshInternalStatus);
      }
    }
  };
  /** Public Api */

  /**
   * Refresh all
   */

  var vsInstances = {};
  function refreshAll() {
    for (var vs in vsInstances) {
      vsInstances[vs].refresh();
    }
  }

  function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

  var ScrollPanel = {
    name: 'ScrollPanel',
    props: {
      ops: {
        type: Object,
        required: true
      }
    },
    methods: {
      // trigger scrollPanel options initialScrollX,
      // initialScrollY
      updateInitialScroll: function updateInitialScroll() {
        var x = 0;
        var y = 0;
        var parent = getRealParent(this);

        if (this.ops.initialScrollX) {
          x = this.ops.initialScrollX;
        }

        if (this.ops.initialScrollY) {
          y = this.ops.initialScrollY;
        }

        if (x || y) {
          parent.scrollTo({
            x: x,
            y: y
          });
        }
      }
    },
    mounted: function mounted() {
      var _this = this;

      setTimeout(function () {
        if (!_this._isDestroyed) {
          _this.updateInitialScroll();
        }
      }, 0);
    },
    render: function render() {
      // eslint-disable-line
      var data = {
        "class": ['__panel'],
        style: {
          position: 'relative',
          boxSizing: 'border-box'
        }
      };
      var parent = getRealParent(this);
      var _customPanel = parent.$slots['scroll-panel'];

      if (_customPanel) {
        return insertChildrenIntoSlot(_customPanel, this.$slots["default"], data);
      }

      return vue.h("div", helper([{}, data]), [this.$slots["default"]()]);
    }
  };

  var colorCache = {};
  var rgbReg = /rgb\(/;
  var extractRgbColor = /rgb\((.*)\)/; // Transform a common color int oa `rgbA` color

  function getRgbAColor(color, opacity) {
    var id = color + '&' + opacity;

    if (colorCache[id]) {
      return colorCache[id];
    }

    var div = document.createElement('div');
    div.style.background = color;
    document.body.appendChild(div);
    var computedColor = window.getComputedStyle(div).backgroundColor;
    document.body.removeChild(div);
    /* istanbul ignore if */

    if (!rgbReg.test(computedColor)) {
      return color;
    }

    return colorCache[id] = "rgba(".concat(extractRgbColor.exec(computedColor)[1], ", ").concat(opacity, ")");
  }

  var Scrollbar = {
    name: 'Scrollbar',
    props: {
      ops: Object,
      state: Object,
      hideBar: Boolean,
      otherBarHide: Boolean,
      type: String
    },
    computed: {
      bar: function bar() {
        return scrollMap[this.type];
      },
      barSize: function barSize() {
        return Math.max(this.state.size, this.ops.bar.minSize);
      },
      barRatio: function barRatio() {
        return (1 - this.barSize) / (1 - this.state.size);
      }
    },
    render: function render() {
      var _style, _style2, _barStyle;

      var vm = this;
      /** Get rgbA format background color */

      var railBackgroundColor = getRgbAColor(vm.ops.rail.background, vm.ops.rail.opacity);
      /** Rail Data */

      var railSize = vm.ops.rail.size;
      var endPos = vm.otherBarHide ? 0 : railSize;
      var touchObj = vm.touchManager.getTouchObject();
      var rail = {
        "class": "__rail-is-".concat(vm.type),
        style: (_style = {
          position: 'absolute',
          'z-index': '1',
          borderRadius: vm.ops.rail.specifyBorderRadius || railSize,
          background: railBackgroundColor,
          border: vm.ops.rail.border
        }, _defineProperty(_style, vm.bar.opsSize, railSize), _defineProperty(_style, vm.bar.posName, vm.ops.rail['gutterOfEnds'] || 0), _defineProperty(_style, vm.bar.opposName, vm.ops.rail['gutterOfEnds'] || endPos), _defineProperty(_style, vm.bar.sidePosName, vm.ops.rail['gutterOfSide']), _style)
      };

      if (touchObj) {
        rail[touchObj.touchenter] = function () {
          vm.setRailHover();
        };

        rail[touchObj.touchleave] = function () {
          vm.setRailLeave();
        };
      } // left space for scroll button


      var buttonSize = vm.ops.scrollButton.enable ? railSize : 0;
      var barWrapper = {
        "class": "__bar-wrap-is-".concat(vm.type),
        style: (_style2 = {
          position: 'absolute',
          borderRadius: vm.ops.rail.specifyBorderRadius || railSize
        }, _defineProperty(_style2, vm.bar.posName, buttonSize), _defineProperty(_style2, vm.bar.opposName, buttonSize), _style2)
      };
      var scrollDistance = vm.state.posValue * vm.state.size;
      var pos = scrollDistance * vm.barRatio / vm.barSize;
      var opacity = vm.state.opacity;
      var parent = getRealParent(this); // set class hook

      parent.setClassHook(this.type == 'vertical' ? 'vBarVisible' : 'hBarVisible', !!opacity);
      /** Scrollbar style */

      var barStyle = (_barStyle = {
        cursor: 'pointer',
        position: 'absolute',
        margin: 'auto',
        transition: 'opacity 0.5s',
        'user-select': 'none',
        'border-radius': 'inherit'
      }, _defineProperty(_barStyle, vm.bar.size, vm.barSize * 100 + '%'), _defineProperty(_barStyle, "background", vm.ops.bar.background), _defineProperty(_barStyle, vm.bar.opsSize, vm.ops.bar.size), _defineProperty(_barStyle, "opacity", opacity), _defineProperty(_barStyle, "transform", "translate".concat(scrollMap[vm.type].axis, "(").concat(pos, "%)")), _barStyle);
      var bar = {
        style: barStyle,
        "class": "__bar-is-".concat(vm.type),
        ref: 'thumb'
      };

      if (vm.type == 'vertical') {
        barWrapper.style.width = '100%'; // Let bar to be on the center.

        bar.style.left = 0;
        bar.style.right = 0;
      } else {
        barWrapper.style.height = '100%';
        bar.style.top = 0;
        bar.style.bottom = 0;
      }
      /* istanbul ignore next */


      {
        var _touchObj = this.touchManager.getTouchObject();

        bar[_touchObj.touchstart] = this.createBarEvent();
        barWrapper[_touchObj.touchstart] = this.createTrackEvent();
      }
      return vue.h("div", helper([{}, rail]), [this.createScrollbarButton('start'), this.hideBar ? null : vue.h("div", helper([{}, barWrapper]), [vue.h("div", helper([{}, bar]))]), this.createScrollbarButton('end')]);
    },
    data: function data() {
      return {
        touchManager: new TouchManager(),
        isBarDragging: false
      };
    },
    methods: {
      setRailHover: function setRailHover() {
        var parent = getRealParent(this);
        var state = parent.vuescroll.state;

        if (!state.isRailHover) {
          state.isRailHover = true;
          parent.showBar();
        }
      },
      setRailLeave: function setRailLeave() {
        var parent = getRealParent(this);
        var state = parent.vuescroll.state;
        state.isRailHover = false;
        parent.hideBar();
      },
      setBarDrag: function setBarDrag(val)
      /* istanbul ignore next */
      {
        this.$emit('setBarDrag', this.isBarDragging = val);
        var parent = getRealParent(this); // set class hook

        parent.setClassHook(this.type == 'vertical' ? 'vBarDragging' : 'hBarDragging', !!val);
      },
      createBarEvent: function createBarEvent() {
        var ctx = this;
        var parent = getRealParent(ctx);
        var touchObj = ctx.touchManager.getTouchObject();

        function mousedown(e)
        /* istanbul ignore next */
        {
          var event = ctx.touchManager.getEventObject(e);
          if (!event) return;
          e.stopImmediatePropagation();
          e.preventDefault();
          event = event[0];

          document.onselectstart = function () {
            return false;
          };

          ctx.axisStartPos = event[ctx.bar.client] - ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName]; // Tell parent that the mouse has been down.

          ctx.setBarDrag(true);
          eventCenter(document, touchObj._touchmove, mousemove);
          eventCenter(document, touchObj._touchend, mouseup);
        }

        function mousemove(e)
        /* istanbul ignore next */
        {
          if (!ctx.axisStartPos) {
            return;
          }

          var event = ctx.touchManager.getEventObject(e);
          if (!event) return;
          event = event[0];
          var thubmParent = ctx.$refs.thumb.parentNode;
          var delta = event[ctx.bar.client] - thubmParent.getBoundingClientRect()[ctx.bar.posName];
          delta = delta / ctx.barRatio;
          var percent = (delta - ctx.axisStartPos) / thubmParent[ctx.bar.offset];
          parent.scrollTo(_defineProperty({}, ctx.bar.axis.toLowerCase(), parent.scrollPanelElm[ctx.bar.scrollSize] * percent), false);
        }

        function mouseup()
        /* istanbul ignore next */
        {
          ctx.setBarDrag(false);
          parent.hideBar();
          document.onselectstart = null;
          ctx.axisStartPos = 0;
          eventCenter(document, touchObj._touchmove, mousemove, false, 'off');
          eventCenter(document, touchObj._touchend, mouseup, false, 'off');
        }

        return mousedown;
      },
      createTrackEvent: function createTrackEvent() {
        var ctx = this;
        return function handleClickTrack(e) {
          var parent = getRealParent(ctx);
          var _ctx$bar = ctx.bar,
              client = _ctx$bar.client,
              offset = _ctx$bar.offset,
              posName = _ctx$bar.posName,
              axis = _ctx$bar.axis;
          var thumb = ctx.$refs['thumb'];
          e.preventDefault();
          e.stopImmediatePropagation();
          /* istanbul ignore if */

          if (!thumb) return;
          var barOffset = thumb[offset];
          var event = ctx.touchManager.getEventObject(e)[0];
          var percent = (event[client] - e.currentTarget.getBoundingClientRect()[posName] - barOffset / 2) / (e.currentTarget[offset] - barOffset);
          parent.scrollTo(_defineProperty({}, axis.toLowerCase(), percent * 100 + '%'));
        };
      },
      // Scrollbuton relative things...
      createScrollbarButton: function createScrollbarButton(type
      /* start or end  */
      ) {
        var _style3;

        var barContext = this;

        if (!barContext.ops.scrollButton.enable) {
          return null;
        }

        var size = barContext.ops.rail.size;
        var _barContext$ops$scrol = barContext.ops.scrollButton,
            opacity = _barContext$ops$scrol.opacity,
            background = _barContext$ops$scrol.background;
        var borderColor = getRgbAColor(background, opacity);
        var wrapperProps = {
          "class": ['__bar-button', '__bar-button-is-' + barContext.type + '-' + type],
          style: (_style3 = {}, _defineProperty(_style3, barContext.bar.scrollButton[type], 0), _defineProperty(_style3, "width", size), _defineProperty(_style3, "height", size), _defineProperty(_style3, "position", 'absolute'), _defineProperty(_style3, "cursor", 'pointer'), _defineProperty(_style3, "display", 'table'), _style3),
          ref: type
        };
        var innerProps = {
          "class": '__bar-button-inner',
          style: {
            border: "calc(".concat(size, " / 2.5) solid transparent"),
            width: '0',
            height: '0',
            margin: 'auto',
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0'
          }
        };

        if (barContext.type == 'vertical') {
          if (type == 'start') {
            innerProps.style['border-bottom-color'] = borderColor;
            innerProps.style['transform'] = 'translateY(-25%)';
          } else {
            innerProps.style['border-top-color'] = borderColor;
            innerProps.style['transform'] = 'translateY(25%)';
          }
        } else {
          if (type == 'start') {
            innerProps.style['border-right-color'] = borderColor;
            innerProps.style['transform'] = 'translateX(-25%)';
          } else {
            innerProps.style['border-left-color'] = borderColor;
            innerProps.style['transform'] = 'translateX(25%)';
          }
        }
        /* istanbul ignore next */


        {
          var touchObj = this.touchManager.getTouchObject();
          innerProps[touchObj.touchstart] = this.createScrollButtonEvent(type, touchObj);
        }
        return vue.h("div", helper([{}, wrapperProps]), [vue.h("div", helper([{}, innerProps]))]);
      },
      createScrollButtonEvent: function createScrollButtonEvent(type, touchObj) {
        var ctx = this;
        var parent = getRealParent(ctx);
        var _ctx$ops$scrollButton = ctx.ops.scrollButton,
            step = _ctx$ops$scrollButton.step,
            mousedownStep = _ctx$ops$scrollButton.mousedownStep;
        var stepWithDirection = type == 'start' ? -step : step;
        var mousedownStepWithDirection = type == 'start' ? -mousedownStep : mousedownStep;
        var ref = requestAnimationFrame(window); // bar props: type

        var barType = ctx.type;
        var isMouseDown = false;
        var isMouseout = true;
        var timeoutId;

        function start(e) {
          /* istanbul ignore if */
          if (3 == e.which) {
            return;
          } // set class hook


          parent.setClassHook("cliking".concat(barType).concat(type, "Button"), true);
          e.stopImmediatePropagation();
          e.preventDefault();
          isMouseout = false;
          parent.scrollBy(_defineProperty({}, 'd' + ctx.bar.axis.toLowerCase(), stepWithDirection));
          eventCenter(document, touchObj._touchend, endPress, false);

          if (touchObj._touchstart == 'mousedown') {
            var elm = ctx.$refs[type];
            eventCenter(elm, 'mouseenter', enter, false);
            eventCenter(elm, 'mouseleave', leave, false);
          }

          clearTimeout(timeoutId);
          timeoutId = setTimeout(function ()
          /* istanbul ignore next */
          {
            isMouseDown = true;
            ref(pressing, window);
          }, 500);
        }

        function pressing()
        /* istanbul ignore next */
        {
          if (isMouseDown && !isMouseout) {
            parent.scrollBy(_defineProperty({}, 'd' + ctx.bar.axis.toLowerCase(), mousedownStepWithDirection), false);
            ref(pressing, window);
          }
        }

        function endPress() {
          clearTimeout(timeoutId);
          isMouseDown = false;
          eventCenter(document, touchObj._touchend, endPress, false, 'off');

          if (touchObj._touchstart == 'mousedown') {
            var elm = ctx.$refs[type];
            eventCenter(elm, 'mouseenter', enter, false, 'off');
            eventCenter(elm, 'mouseleave', leave, false, 'off');
          }

          parent.setClassHook("cliking".concat(barType).concat(type, "Button"), false);
        }

        function enter()
        /* istanbul ignore next */
        {
          isMouseout = false;
          pressing();
        }

        function leave()
        /* istanbul ignore next */
        {
          isMouseout = true;
        }

        return start;
      }
    }
  };

  function getBarData(vm, type) {
    var axis = scrollMap[type].axis;
    /** type.charAt(0) = vBar/hBar */

    var barType = "".concat(type.charAt(0), "Bar");
    var hideBar = !vm.bar[barType].state.size || !vm.mergedOptions.scrollPanel['scrolling' + axis] || vm.refreshLoad && type !== 'vertical' || vm.mergedOptions.bar.disable;
    var keepShowRail = vm.mergedOptions.rail.keepShow;

    if (hideBar && !keepShowRail) {
      return null;
    }

    return {
      hideBar: hideBar,
      type: type,
      ops: {
        bar: vm.mergedOptions.bar,
        rail: vm.mergedOptions.rail,
        scrollButton: vm.mergedOptions.scrollButton
      },
      state: vm.bar[barType].state,
      onSetBarDrag: vm.setBarDrag,
      ref: "".concat(type, "Bar"),
      key: type
    };
  }
  /**
   * create bars
   *
   * @param {any} size
   * @param {any} type
   */

  function createBar(vm) {
    var verticalBarProps = getBarData(vm, 'vertical');
    var horizontalBarProps = getBarData(vm, 'horizontal'); // set class hooks

    vm.setClassHook('hasVBar', !!(verticalBarProps && !verticalBarProps.hideBar));
    vm.setClassHook('hasHBar', !!(horizontalBarProps && !horizontalBarProps.hideBar));
    return [verticalBarProps ? vue.h(Scrollbar, helper([{}, _objectSpread2(_objectSpread2({}, verticalBarProps), {
      props: _objectSpread2(_objectSpread2({}, {
        otherBarHide: !horizontalBarProps
      }), verticalBarProps.props)
    })])) : null, horizontalBarProps ? vue.h(Scrollbar, helper([{}, _objectSpread2(_objectSpread2({}, horizontalBarProps), {
      props: _objectSpread2(_objectSpread2({}, {
        otherBarHide: !verticalBarProps
      }), horizontalBarProps.props)
    })])) : null];
  }

  /**
   * This is like a HOC, It extracts the common parts of the
   * native-mode, slide-mode and mix-mode.
   * Each mode must implement the following methods:
   * 1. refreshInternalStatus : use to refresh the component
   * 2. destroy : Destroy some registryed events before component destroy.
   * 3. updateBarStateAndEmitEvent: use to update bar states and emit events.
   */

  var createComponent = function createComponent(_ref) {
    var _components;

    var _render = _ref.render,
        mixins = _ref.mixins;
    var components = (_components = {}, _defineProperty(_components, ScrollPanel.name, ScrollPanel), _defineProperty(_components, Scrollbar.name, Scrollbar), _components);
    return {
      name: 'vueScroll',
      emits: ['refresh-status', 'handle-scroll', 'handle-resize', 'window-resize', 'handle-scroll-complete', 'options-change'],
      props: {
        ops: {
          type: Object
        }
      },
      components: components,
      mixins: [api$1].concat(_toConsumableArray([].concat(mixins))),
      created: function created() {
        var _this = this;

        /**
         * Begin to merge options
         */
        var _gfc = mergeObject(this.$vuescrollConfig || {}, {});

        var ops = mergeObject(baseConfig, _gfc);
        var propsOps = this.ops || {};
        Object.keys(propsOps).forEach(function (key) {
          {
            defineReactive(_this.mergedOptions, key, propsOps);
          }
        }); // from ops to mergedOptions

        mergeObject(ops, this.mergedOptions);
        this.$data._isVuescrollRoot = true;
        this.renderError = validateOps(this.mergedOptions);
      },
      render: function render() {
        var vm = this;

        if (vm.renderError) {
          return vue.h("div", [[vm.$slots['default']]]);
        } // vuescroll data


        var data = {
          style: {
            height: vm.vuescroll.state.height,
            width: vm.vuescroll.state.width,
            padding: 0,
            position: 'relative',
            overflow: 'hidden'
          },
          "class": _objectSpread2({
            __vuescroll: true
          }, vm.classHooks)
        };
        var touchObj = vm.touchManager.getTouchObject();

        if (touchObj) {
          data[touchObj.touchenter] = function () {
            vm.vuescroll.state.pointerLeave = false;
            vm.updateBarStateAndEmitEvent();
            vm.setClassHook('mouseEnter', true);
          };

          data[touchObj.touchleave] = function () {
            vm.vuescroll.state.pointerLeave = true;
            vm.hideBar();
            vm.setClassHook('mouseEnter', false);
          };

          data[touchObj.touchmove] = function ()
          /* istanbul ignore next */
          {
            vm.vuescroll.state.pointerLeave = false;
            vm.updateBarStateAndEmitEvent();
          };
        }

        var ch = {
          "default": function _default() {
            return [_render(vm)].concat(_toConsumableArray(createBar(vm)));
          }
        };
        var _customContainer = this.$slots['scroll-container'];

        if (_customContainer) {
          return insertChildrenIntoSlot(_customContainer, ch["default"], data);
        }

        return vue.h('div', data, ch);
      },
      mounted: function mounted() {
        var _this2 = this;

        if (!this.renderError) {
          this.initVariables();
          this.initWatchOpsChange(); // Call external merged Api

          this.refreshInternalStatus();
          this.updatedCbs.push(function () {
            _this2.scrollToAnchor(); // need to reflow to deal with the
            // latest thing.


            _this2.updateBarStateAndEmitEvent();
          });
        }
      },
      updated: function updated() {
        var _this3 = this;

        this.updatedCbs.forEach(function (cb) {
          cb.call(_this3);
        }); // Clear

        this.updatedCbs = [];
      },
      beforeUnmount: function beforeUnmount() {
        /* istanbul ignore next */
        if (this.destroy) {
          this.destroy();
        }
      },

      /** ------------------------------- Computed ----------------------------- */
      computed: {
        scrollPanelElm: function scrollPanelElm() {
          return this.$refs['scrollPanel'].$el;
        }
      },
      data: function data() {
        return {
          touchManager: new TouchManager(),
          vuescroll: {
            state: {
              isDragging: false,
              pointerLeave: true,
              isRailHover: false,

              /** Default sizeStrategies */
              height: '100%',
              width: '100%',
              // current size strategy
              currentSizeStrategy: 'percent',
              currentScrollState: null,
              currentScrollInfo: null
            }
          },
          bar: {
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
            }
          },
          mergedOptions: {
            vuescroll: {},
            scrollPanel: {},
            scrollContent: {},
            rail: {},
            bar: {}
          },
          updatedCbs: [],
          renderError: false,
          classHooks: {
            hasVBar: false,
            hasHBar: false,
            vBarVisible: false,
            hBarVisible: false,
            vBarDragging: false,
            hBarDragging: false,
            clikingVerticalStartButton: false,
            clikingVerticalEndButton: false,
            clikingHorizontalStartButton: false,
            clikingHorizontalEndButton: false,
            mouseEnter: false
          }
        };
      },

      /** ------------------------------- Methods -------------------------------- */
      methods: {
        /** ------------------------ Handlers --------------------------- */
        scrollingComplete: function scrollingComplete() {
          this.updateBarStateAndEmitEvent('handle-scroll-complete');
        },
        setBarDrag: function setBarDrag(val) {
          /* istanbul ignore next */
          this.vuescroll.state.isDragging = val;
        },
        setClassHook: function setClassHook(name, value) {
          this.classHooks[name] = value;
        },

        /** ------------------------ Some Helpers --------------------------- */

        /*
         * To have a good ux, instead of hiding bar immediately, we hide bar
         * after some seconds by using this simple debounce-hidebar method.
         */
        showAndDefferedHideBar: function showAndDefferedHideBar(forceHideBar) {
          var _this4 = this;

          this.showBar();

          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = 0;
          }

          this.timeoutId = setTimeout(function () {
            _this4.timeoutId = 0;

            _this4.hideBar(forceHideBar);
          }, this.mergedOptions.bar.showDelay);
        },
        showBar: function showBar() {
          var opacity = this.mergedOptions.bar.opacity;
          this.bar.vBar.state.opacity = opacity;
          this.bar.hBar.state.opacity = opacity;
        },
        hideBar: function hideBar(forceHideBar) {
          var _this$vuescroll$state = this.vuescroll.state,
              isDragging = _this$vuescroll$state.isDragging,
              isRailHover = _this$vuescroll$state.isRailHover;
          /* istanbul ignore next */

          if (isDragging || isRailHover) {
            return;
          }

          if (forceHideBar && !this.mergedOptions.bar.keepShow) {
            this.bar.hBar.state.opacity = 0;
            this.bar.vBar.state.opacity = 0;
          } // add isDragging condition
          // to prevent from hiding bar while dragging the bar


          if (!this.mergedOptions.bar.keepShow && !this.vuescroll.state.isDragging) {
            this.bar.vBar.state.opacity = 0;
            this.bar.hBar.state.opacity = 0;
          }
        },
        useNumbericSize: function useNumbericSize() {
          this.vuescroll.state.currentSizeStrategy = 'number';
          var _this$mergedOptions$s = this.mergedOptions.scrollPanel,
              maxHeight = _this$mergedOptions$s.maxHeight,
              maxWidth = _this$mergedOptions$s.maxWidth;
          var _this$$el$parentNode = this.$el.parentNode,
              parentClientHeight = _this$$el$parentNode.clientHeight,
              parentClientWidth = _this$$el$parentNode.clientWidth;
          var _this$scrollPanelElm = this.scrollPanelElm,
              scrollHeight = _this$scrollPanelElm.scrollHeight,
              scrollWidth = _this$scrollPanelElm.scrollWidth;
          var width;
          var height;

          if (maxHeight || maxWidth) {
            height = scrollHeight <= maxHeight ? undefined : maxHeight;
            width = scrollWidth <= maxWidth ? undefined : maxWidth;
          } else {
            height = parentClientHeight;
            width = parentClientWidth;
          }

          this.vuescroll.state.height = height ? height + 'px' : undefined;
          this.vuescroll.state.width = width ? width + 'px' : undefined;
        },
        usePercentSize: function usePercentSize() {
          this.vuescroll.state.currentSizeStrategy = 'percent';
          this.vuescroll.state.height = '100%';
          this.vuescroll.state.width = '100%';
        },
        // Set its size to be equal to its parentNode
        setVsSize: function setVsSize() {
          var sizeStrategy = this.mergedOptions.vuescroll.sizeStrategy;
          var _this$mergedOptions$s2 = this.mergedOptions.scrollPanel,
              maxHeight = _this$mergedOptions$s2.maxHeight,
              maxWidth = _this$mergedOptions$s2.maxWidth;
          var _this$scrollPanelElm2 = this.scrollPanelElm,
              clientHeight = _this$scrollPanelElm2.clientHeight,
              clientWidth = _this$scrollPanelElm2.clientWidth;

          if (sizeStrategy == 'number' || maxHeight && clientHeight > maxHeight || maxWidth && clientWidth > maxWidth) {
            this.useNumbericSize();
          } else if (sizeStrategy == 'percent' && clientHeight != maxHeight && clientWidth != maxWidth) {
            this.usePercentSize();
          }
        },

        /** ------------------------ Init --------------------------- */
        initWatchOpsChange: function initWatchOpsChange() {
          var _this5 = this;

          var watchOpts = {
            deep: true,
            flush: 'sync'
          };
          this.$watch('mergedOptions', function () {
            setTimeout(function () {
              if (_this5.isSmallChangeThisTick) {
                _this5.isSmallChangeThisTick = false;

                _this5.updateBarStateAndEmitEvent('options-change');

                return;
              }

              _this5.refreshInternalStatus();
            }, 0);
          }, watchOpts);
          /**
           * We also watch `small` changes, and when small changes happen, we send
           * a signal to vuescroll, to tell it:
           * 1. we don't need to registry resize
           * 2. we don't need to registry scroller.
           */

          this.$watch(function () {
            return [_this5.mergedOptions.vuescroll.pullRefresh.tips, _this5.mergedOptions.vuescroll.pushLoad.tips, _this5.mergedOptions.vuescroll.scroller.disable, _this5.mergedOptions.rail, _this5.mergedOptions.bar];
          }, function () {
            _this5.isSmallChangeThisTick = true;
          }, watchOpts);
        },
        // scrollTo hash-anchor while mounted component have mounted.
        scrollToAnchor: function scrollToAnchor()
        /* istanbul ignore next */
        {
          var validateHashSelector = function validateHashSelector(hash) {
            return /^#[a-zA-Z_]\d*$/.test(hash);
          };

          var hash = window.location.hash;

          if (!hash || (hash = hash.slice(hash.lastIndexOf('#'))) && !validateHashSelector(hash)) {
            return;
          }

          var elm = document.querySelector(hash);

          if (!isChildInParent(elm, this.$el) || this.mergedOptions.scrollPanel.initialScrollY || this.mergedOptions.scrollPanel.initialScrollX) {
            return;
          }

          this.scrollIntoView(elm);
        }
        /** ------------------------ Registry Resize --------------------------- */

      }
    };
  };

  function _install(core, render) {
    var extraConfigs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var extraValidators = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var opts = {};
    opts.render = render;
    opts.mixins = core;
    var component = createComponent(opts); // Init Config

    extendOpts(extraConfigs, extraValidators);
    return _objectSpread2({
      install: function install(Vue) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        Vue.component(opts.name || component.name, component);
        Vue.config.globalProperties.$vuescrollConfig = opts.ops || {};
      },
      version: '5.0.0',
      refreshAll: refreshAll
    }, component);
  }

  function getPanelData(context) {
    // scrollPanel data start
    var data = {
      ref: 'scrollPanel',
      style: {
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'scroll'
      },
      "class": [],
      onScroll: context.handleScroll,
      onDOMMouseScroll: context.onMouseWheel,
      onMousewheel: context.onMouseWheel,
      ops: context.mergedOptions.scrollPanel
    };
    context.scrollYEnable = true;
    context.scrollXEnable = true;
    var _context$mergedOption = context.mergedOptions.scrollPanel,
        scrollingY = _context$mergedOption.scrollingY,
        scrollingX = _context$mergedOption.scrollingX;

    if (!context.bar.hBar.state.size || !scrollingX) {
      context.scrollXEnable = false;
      data.style.overflowX = 'hidden';
    }

    if (!context.bar.vBar.state.size || !scrollingY) {
      context.scrollYEnable = false;
      data.style.overflowY = 'hidden';
    }

    var gutter = getGutter();
    /* istanbul ignore if */

    if (!gutter) {
      createHideBarStyle();
      data["class"].push('__hidebar');

      if (isIos()) {
        data.style['-webkit-overflow-scrolling'] = 'touch';
      }
    } else {
      // hide system bar by use a negative value px
      // gutter should be 0 when manually disable scrollingX #14
      if (context.bar.vBar.state.size && context.mergedOptions.scrollPanel.scrollingY) {
        if (context.mergedOptions.scrollPanel.verticalNativeBarPos == 'right') {
          data.style.marginRight = "-".concat(gutter, "px");
        }
        /* istanbul ignore next */
        else {
            data.style.marginLeft = "-".concat(gutter, "px");
          }
      }

      if (context.bar.hBar.state.size && context.mergedOptions.scrollPanel.scrollingX) {
        data.style.height = "calc(100% + ".concat(gutter, "px)");
      }
    } // clear legency styles of slide mode...


    data.style.transformOrigin = null;
    data.style.transform = null;
    return data;
  }
  /**
   * create a scrollPanel
   *
   * @param {any} size
   * @param {any} context
   * @returns
   */

  function createPanel(context) {
    var data = {};
    data = getPanelData(context);
    return vue.h(ScrollPanel, data, {
      "default": function _default() {
        return getPanelChildren(context);
      }
    });
  }
  function getPanelChildren(context) {
    var viewStyle = {
      position: 'relative',
      'box-sizing': 'border-box',
      'min-width': '100%',
      'min-height': '100%'
    };
    var data = {
      style: viewStyle,
      ref: 'scrollContent',
      "class": '__view'
    };
    var _customContent = context.$slots['scroll-content'];

    if (context.mergedOptions.scrollPanel.scrollingX) {
      viewStyle.width = getComplitableStyle('width', 'fit-content');
    } else {
      data.style['width'] = '100%';
    }

    if (context.mergedOptions.scrollPanel.padding) {
      data.style.paddingRight = context.mergedOptions.rail.size;
    }

    if (_customContent) {
      return insertChildrenIntoSlot(_customContent, context.$slots["default"], data);
    }

    return vue.h("div", helper([{}, data]), [context.$slots["default"]()]);
  }

  // detect content size change
  function installResizeDetection(element, callback) {
    return injectObject(element, callback);
  }

  function injectObject(element, callback) {
    if (element.hasResized) {
      return;
    }

    var OBJECT_STYLE = 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;'; // define a wrap due to ie's zIndex bug

    var objWrap = document.createElement('div');
    objWrap.style.cssText = OBJECT_STYLE;
    var object = document.createElement('object');
    object.style.cssText = OBJECT_STYLE;
    object.type = 'text/html';
    object.tabIndex = -1;

    object.onload = function () {
      eventCenter(object.contentDocument.defaultView, 'resize', callback);
    }; // https://github.com/wnr/element-resize-detector/blob/aafe9f7ea11d1eebdab722c7c5b86634e734b9b8/src/detection-strategy/object.js#L159


    if (!isIE()) {
      object.data = 'about:blank';
    }

    objWrap.isResizeElm = true;
    objWrap.appendChild(object);
    element.appendChild(objWrap);

    if (isIE()) {
      object.data = 'about:blank';
    }

    return function destroy() {
      if (object.contentDocument) {
        eventCenter(object.contentDocument.defaultView, 'resize', callback, 'off');
      }

      element.removeChild(objWrap);
      element.hasResized = false;
    };
  }

  /**
   * These mixes is exclusive for native mode
   */
  var update = {
    methods: {
      updateNativeModeBarState: function updateNativeModeBarState() {
        var container = this.scrollPanelElm;
        var isPercent = this.vuescroll.state.currentSizeStrategy == 'percent';
        var _this$vuescroll$state = this.vuescroll.state,
            width = _this$vuescroll$state.width,
            height = _this$vuescroll$state.height;
        var clientWidth = isPercent || !width ? container.clientWidth : width.slice(0, -2); // xxxpx ==> xxx

        var clientHeight = isPercent || !height ? container.clientHeight : height.slice(0, -2);
        var heightPercentage = clientHeight / container.scrollHeight;
        var widthPercentage = clientWidth / container.scrollWidth;
        this.bar.vBar.state.posValue = container.scrollTop * 100 / clientHeight;
        this.bar.hBar.state.posValue = container.scrollLeft * 100 / clientWidth;
        this.bar.vBar.state.size = heightPercentage < 1 ? heightPercentage : 0;
        this.bar.hBar.state.size = widthPercentage < 1 ? widthPercentage : 0;
      },
      getNativePosition: function getNativePosition() {
        return {
          scrollTop: this.scrollPanelElm.scrollTop,
          scrollLeft: this.scrollPanelElm.scrollLeft
        };
      },
      css: function css(dom, style)
      /* istanbul ignore next */
      {
        return window.getComputedStyle(dom)[style];
      },
      checkScrollable: function checkScrollable(e, deltaX, deltaY)
      /* istanbul ignore next */
      {
        var scrollable = false; // check mouse point scrollable.

        var dom = e.target ? e.target : e;

        while (dom && dom.nodeType == 1 && dom !== this.scrollPanelElm.parentNode && !/^BODY|HTML/.test(dom.nodeName)) {
          var ov = this.css(dom, 'overflow') || '';

          if (/scroll|auto/.test(ov)) {
            var _this$getScrollProces = this.getScrollProcess(dom),
                v = _this$getScrollProces.v,
                h = _this$getScrollProces.h;

            var isScrollX = this.css(dom, 'overflowX') !== 'hidden';
            var isScrollY = this.css(dom, 'overflowY') !== 'hidden';

            if (isScrollX && (deltaX < 0 && h > 0 || deltaX > 0 && h < 1) || isScrollY && (deltaY < 0 && v > 0 || deltaY > 0 && v < 1)) {
              scrollable = dom == this.scrollPanelElm;
              break;
            }
          }

          dom = dom.parentNode ? dom.parentNode : false;
        }

        return scrollable;
      },
      onMouseWheel: function onMouseWheel(event)
      /* istanbul ignore next */
      {
        var _this$mergedOptions$v = this.mergedOptions.vuescroll,
            isReverse = _this$mergedOptions$v.wheelDirectionReverse,
            duration = _this$mergedOptions$v.wheelScrollDuration,
            checkShiftKey = _this$mergedOptions$v.checkShiftKey,
            locking = _this$mergedOptions$v.locking;
        var deltaX;
        var deltaY;

        if (event.wheelDelta) {
          if (event.deltaY || event.deltaX) {
            deltaX = event.deltaX;
            deltaY = event.deltaY;

            if (locking) {
              if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                deltaY = 0;
              } else {
                deltaX = 0;
              }
            }
          } else {
            deltaX = 0;
            deltaY = -1 * event.wheelDelta / 2;
          }
        } else if (event.detail) {
          deltaY = deltaX = event.detail * 16; // horizontal scroll

          if (event.axis == 1) {
            deltaY = 0;
          } else if (event.axis == 2) {
            // vertical scroll
            deltaX = 0;
          }
        }

        if (checkShiftKey && event.shiftKey) {
          // swap value
          deltaX ^= deltaY;
          deltaY ^= deltaX;
          deltaX ^= deltaY;
        }

        if (isReverse) {
          deltaX ^= deltaY;
          deltaY ^= deltaX;
          deltaX ^= deltaY;
        }

        if (this.checkScrollable(event, deltaX, deltaY)) {
          event.stopPropagation();
          event.preventDefault();
          this.scrollBy({
            dx: deltaX,
            dy: deltaY
          }, duration);
        }
      }
    },
    computed: {
      scrollContentElm: function scrollContentElm() {
        return this.$refs['scrollContent'].$el || this.$refs['scrollContent'];
      }
    }
  };

  var mixins = [api, update];

  var core = {
    mixins: mixins,
    methods: {
      destroy: function destroy() {
        /* istanbul ignore next */
        if (this.destroyResize) {
          this.destroyResize();
        }
      },
      getCurrentviewDom: function getCurrentviewDom() {
        return this.getCurrentviewDomNative();
      },
      internalScrollTo: function internalScrollTo(destX, destY, animate, easing) {
        this.nativeScrollTo(destX, destY, animate, easing);
      },
      internalStop: function internalStop() {
        this.nativeStop();
      },
      internalPause: function internalPause() {
        this.nativePause();
      },
      internalContinue: function internalContinue() {
        this.nativeContinue();
      },
      handleScroll: function handleScroll(nativeEvent) {
        this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
      },
      updateBarStateAndEmitEvent: function updateBarStateAndEmitEvent(eventType) {
        var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this.updateNativeModeBarState();

        if (eventType) {
          this.emitEvent(eventType, nativeEvent);
        }

        if (this.mergedOptions.bar.onlyShowBarOnScroll) {
          if (eventType == 'handle-scroll' || eventType == 'handle-resize' || eventType == 'refresh-status' || eventType == 'window-resize' || eventType == 'options-change') {
            this.showAndDefferedHideBar(true
            /* forceHideBar: true */
            );
          }
        } else {
          this.showAndDefferedHideBar();
        }
      },
      getScrollProcess: function getScrollProcess(elm) {
        var _ref = elm || this.scrollPanelElm,
            scrollHeight = _ref.scrollHeight,
            scrollWidth = _ref.scrollWidth,
            clientHeight = _ref.clientHeight,
            clientWidth = _ref.clientWidth,
            scrollTop = _ref.scrollTop,
            scrollLeft = _ref.scrollLeft;

        var v = Math.min(scrollTop / (scrollHeight - clientHeight || 1), 1);
        var h = Math.min(scrollLeft / (scrollWidth - clientWidth || 1), 1);
        return {
          v: v,
          h: h
        };
      },
      emitEvent: function emitEvent(eventType) {
        var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _this$scrollPanelElm = this.scrollPanelElm,
            scrollTop = _this$scrollPanelElm.scrollTop,
            scrollLeft = _this$scrollPanelElm.scrollLeft;
        var vertical = {
          type: 'vertical'
        };
        var horizontal = {
          type: 'horizontal'
        };

        var _this$getScrollProces = this.getScrollProcess(),
            v = _this$getScrollProces.v,
            h = _this$getScrollProces.h;

        vertical.process = v;
        horizontal.process = h;
        vertical['barSize'] = this.bar.vBar.state.size;
        horizontal['barSize'] = this.bar.hBar.state.size;
        vertical['scrollTop'] = scrollTop;
        horizontal['scrollLeft'] = scrollLeft;
        this.$emit(eventType, vertical, horizontal, nativeEvent);
      },
      initVariables: function initVariables() {
        this.$el._isVuescroll = true;
      },
      refreshInternalStatus: function refreshInternalStatus() {
        // 1.set vuescroll height or width according to
        // sizeStrategy
        this.setVsSize(); // 2. registry resize event

        this.registryResize(); // 3. update scrollbar's height/width

        this.updateBarStateAndEmitEvent('refresh-status');
      },
      registryResize: function registryResize() {
        var _this = this;

        var resizeEnable = this.mergedOptions.vuescroll.detectResize;
        /* istanbul ignore next */

        if (this.destroyResize && resizeEnable) {
          return;
        }

        if (this.destroyResize) {
          this.destroyResize();
        }

        if (!resizeEnable) {
          return;
        }

        var contentElm = this.scrollContentElm;
        var vm = this;

        var handleWindowResize = function handleWindowResize()
        /* istanbul ignore next */
        {
          vm.updateBarStateAndEmitEvent('window-resize');
        };

        var handleDomResize = function handleDomResize() {
          var currentSize = {};
          currentSize['width'] = _this.scrollPanelElm.scrollWidth;
          currentSize['height'] = _this.scrollPanelElm.scrollHeight;

          _this.updateBarStateAndEmitEvent('handle-resize', currentSize); // Since content sie changes, we should tell parent to set
          // correct size to fit content's size


          _this.setVsSize();
        };

        window.addEventListener('resize', handleWindowResize, false);
        var destroyDomResize = installResizeDetection(contentElm, handleDomResize);

        var destroyWindowResize = function destroyWindowResize() {
          window.removeEventListener('resize', handleWindowResize, false);
        };

        this.destroyResize = function () {
          destroyWindowResize();
          destroyDomResize();
          _this.destroyResize = null;
        };
      },
      getPosition: function getPosition() {
        return this.getNativePosition();
      }
    }
  };

  var configs = [{
    vuescroll: {
      wheelScrollDuration: 0,
      wheelDirectionReverse: false,
      checkShiftKey: true
    }
  }];

  var Vuescroll = _objectSpread2({
    scrollTo: scrollTo
  }, _install(core, createPanel, configs));

  return Vuescroll;

})));
