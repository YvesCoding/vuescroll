/*
    * Vuescroll v5.1.1
    * (c) 2018-2023 Yi(Yves) Wang
    * Released under the MIT License
    * Github: https://github.com/YvesCoding/vuescroll
    * Website: http://vuescrolljs.yvescoding.me/
    */
   
import { h, createVNode } from 'vue';

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

var NOOP = function NOOP() {};
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

// all modes
var modes = ['slide', 'native']; // some small changes.

var __REFRESH_DOM_NAME = 'refreshDom';
var __LOAD_DOM_NAME = 'loadDom';

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

  return h(tag, mergeObject(data, parentVnode[0].props || {}, // merge our props and the props that user passed to custom component.
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

function createSlideModeStyle() {
  var cssText = "\n    @-webkit-keyframes loading-rotate {\n      to {\n        -webkit-transform: rotate(1turn);\n        transform: rotate(1turn);\n      }\n    }\n\n    @keyframes loading-rotate {\n      to {\n        -webkit-transform: rotate(1turn);\n        transform: rotate(1turn);\n      }\n    }\n\n    @-webkit-keyframes loading-wipe {\n      0% {\n        stroke-dasharray: 1, 200;\n        stroke-dashoffset: 0;\n      }\n      50% {\n        stroke-dasharray: 90, 150;\n        stroke-dashoffset: -40px;\n      }\n      to {\n        stroke-dasharray: 90, 150;\n        stroke-dashoffset: -120px;\n      }\n    }\n\n    @keyframes loading-wipe {\n      0% {\n        stroke-dasharray: 1, 200;\n        stroke-dashoffset: 0;\n      }\n      50% {\n        stroke-dasharray: 90, 150;\n        stroke-dashoffset: -40px;\n      }\n      to {\n        stroke-dasharray: 90, 150;\n        stroke-dashoffset: -120px;\n      }\n    }\n\n    .__vuescroll .__refresh,\n    .__vuescroll .__load {\n      position: absolute;\n      width: 100%;\n      color: black;\n      height: 50px;\n      line-height: 50px;\n      text-align: center;\n      font-size: 16px;\n    }\n    .__vuescroll .__refresh svg,\n    .__vuescroll .__load svg {\n      margin-right: 10px;\n      width: 25px;\n      height: 25px;\n      vertical-align: sub;\n    }\n    .__vuescroll .__refresh svg.active,\n    .__vuescroll .__load svg.active {\n      transition: all 0.2s;\n    }\n    .__vuescroll .__refresh svg.active.deactive,\n    .__vuescroll .__load svg.active.deactive {\n      transform: rotateZ(180deg);\n    }\n    .__vuescroll .__refresh svg path,\n    .__vuescroll .__refresh svg rect,\n    .__vuescroll .__load svg path,\n    .__vuescroll .__load svg rect {\n      fill: #20a0ff;\n    }\n    .__vuescroll .__refresh svg.start,\n    .__vuescroll .__load svg.start {\n      stroke: #343640;\n      stroke-width: 4;\n      stroke-linecap: round;\n      -webkit-animation: loading-rotate 2s linear infinite;\n      animation: loading-rotate 2s linear infinite;\n    }\n    .__vuescroll .__refresh svg.start .bg-path,\n    .__vuescroll .__load svg.start .bg-path {\n      stroke: #f2f2f2;\n      fill: none;\n    }\n    .__vuescroll .__refresh svg.start .active-path,\n    .__vuescroll .__load svg.start .active-path {\n      stroke: #20a0ff;\n      fill: none;\n      stroke-dasharray: 90, 150;\n      stroke-dashoffset: 0;\n      -webkit-animation: loading-wipe 1.5s ease-in-out infinite;\n      animation: loading-wipe 1.5s ease-in-out infinite;\n    }\n  ";
  createStyle('vuescroll-silde-mode-style', cssText);
}
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
var nativeApi = {
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
var api = {
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

    return createVNode("div", data, [this.$slots["default"]()]);
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
    return createVNode("div", rail, [this.createScrollbarButton('start'), this.hideBar ? null : createVNode("div", barWrapper, [createVNode("div", bar, null)]), this.createScrollbarButton('end')]);
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
      return createVNode("div", wrapperProps, [createVNode("div", innerProps, null)]);
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
  return [verticalBarProps ? createVNode(Scrollbar, _objectSpread2(_objectSpread2({}, verticalBarProps), {
    props: _objectSpread2(_objectSpread2({}, {
      otherBarHide: !horizontalBarProps
    }), verticalBarProps.props)
  }), null) : null, horizontalBarProps ? createVNode(Scrollbar, _objectSpread2(_objectSpread2({}, horizontalBarProps), {
    props: _objectSpread2(_objectSpread2({}, {
      otherBarHide: !verticalBarProps
    }), horizontalBarProps.props)
  }), null) : null];
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
    mixins: [api].concat(_toConsumableArray([].concat(mixins))),
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
        return createVNode("div", null, [[vm.$slots['default']]]);
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

      return h('div', data, ch);
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
    version: '5.1.1',
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
  return h(ScrollPanel, data, {
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

  return createVNode("div", data, [context.$slots["default"]()]);
}

function getPanelData$1(context) {
  // scrollPanel data start
  var data = {
    ref: 'scrollPanel',
    style: {
      'user-select': 'none',
      '-webkit-user-select': 'none',
      'min-width': '100%',
      'min-height': '100%'
    },
    "class": [],
    ops: context.mergedOptions.scrollPanel
  };
  data["class"].push('__slide');
  /* istanbul ignore if */

  if (isIos()) {
    data.style = _defineProperty({}, '-webkit-overflow-scrolling', 'touch');
  }

  if (context.mergedOptions.vuescroll.renderMethod == 'transform') {
    data.style['transform-origin'] = 'left top 0px';
  }

  var _context$mergedOption = context.mergedOptions.scrollPanel,
      scrollingX = _context$mergedOption.scrollingX,
      scrollingY = _context$mergedOption.scrollingY,
      padding = _context$mergedOption.padding;

  if (scrollingX && !context.refreshLoad) {
    var width = getComplitableStyle('width', 'fit-content');

    if (width) {
      data.style['width'] = width;
    }
    /* istanbul ignore next */
    else {
        data['display'] = 'inline-block';
      }
  }
  /* istanbul ignore if */


  if (!scrollingX) {
    data["class"].push('x-hidden');
  }
  /* istanbul ignore if */


  if (!scrollingY) {
    data["class"].push('y-hidden');
  }

  if (padding) {
    data.style.paddingRight = context.mergedOptions.rail.size;
  }

  return data;
}
function getPanelChildren$1(context) {
  var renderChildren = context.$slots['scroll-panel'] || context.$slots["default"];
  var finalChildren = [];
  /* istanbul ignore if */

  if (!renderChildren) {
    context.$slots["default"] = renderChildren = [];
  } // handle refresh


  if (context.mergedOptions.vuescroll.pullRefresh.enable) {
    finalChildren.push(createVNode("div", {
      "class": "__refresh",
      "style": {
        visibility: context.refrehDomVisiable ? '' : 'hidden'
      },
      "ref": __REFRESH_DOM_NAME,
      "key": __REFRESH_DOM_NAME
    }, [createTipDom(context, 'refresh', context.pullRefreshTip)]));
  }

  finalChildren.push(renderChildren()); // handle load

  if (context.mergedOptions.vuescroll.pushLoad.enable) {
    finalChildren.push(createVNode("div", {
      "ref": __LOAD_DOM_NAME,
      "key": __LOAD_DOM_NAME,
      "class": "__load",
      "style": {
        visibility: context.loadDomVisiable ? '' : 'hidden'
      }
    }, [createTipDom(context, 'load', context.pushLoadTip)]));
  }

  return finalChildren;
} // Create load or refresh tip dom of each stages

function createTipDom(context, type, tip) {
  var stage = context.vuescroll.state["".concat(type, "Stage")];
  var dom = null; // Return user specified animation dom

  /* istanbul ignore if */

  if (dom = context.$slots["".concat(type, "-").concat(stage)]) {
    return dom;
  }

  switch (stage) {
    // The dom will show at deactive stage
    case 'deactive':
    case 'active':
      {
        var className = 'active';

        if (stage == 'deactive') {
          className += ' deactive';
        }

        dom = createVNode("svg", {
          "class": className,
          "version": "1.1",
          "xmlns": "http://www.w3.org/2000/svg",
          "xmlnsXlink": "http://www.w3.org/1999/xlink",
          "x": "0px",
          "y": "0px",
          "viewBox": "0 0 1000 1000",
          "enable-background": "new 0 0 1000 1000",
          "xmlSpace": "preserve"
        }, [createVNode("g", null, [createVNode("g", {
          "transform": "matrix(1 0 0 -1 0 1008)"
        }, [createVNode("path", {
          "d": "M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z"
        }, null)])])]);
      }
      break;

    case 'start':
      dom = createVNode("svg", {
        "viewBox": "0 0 50 50",
        "class": "start"
      }, [createVNode("circle", {
        "stroke": "true",
        "cx": "25",
        "cy": "25",
        "r": "20",
        "class": "bg-path"
      }, null), createVNode("circle", {
        "cx": "25",
        "cy": "25",
        "r": "20",
        "class": "active-path"
      }, null)]);
      break;

    case 'beforeDeactive':
      dom = createVNode("svg", {
        "viewBox": "0 0 1024 1024",
        "version": "1.1",
        "xmlns": "http://www.w3.org/2000/svg",
        "p-id": "3562"
      }, [createVNode("path", {
        "d": "M512 0C229.706831 0 0 229.667446 0 512s229.667446 512 512 512c282.293169 0 512-229.667446 512-512S794.332554 0 512 0z m282.994215 353.406031L433.2544 715.145846a31.484062 31.484062 0 0 1-22.275938 9.231754h-0.4096a31.586462 31.586462 0 0 1-22.449231-9.814646L228.430769 546.327631a31.507692 31.507692 0 0 1 45.701908-43.386093l137.4208 144.785724L750.442338 308.854154a31.507692 31.507692 0 1 1 44.551877 44.551877z",
        "fill": "",
        "p-id": "3563"
      }, null)]);
      break;
  }

  return [dom, tip];
}
/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} context
 * @returns
 */


function createPanel$1(context) {
  var data = getPanelData$1(context);
  return h(ScrollPanel, data, {
    "default": function _default() {
      return getPanelChildren$1(context);
    }
  });
}

// begin importing
/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */

function createPanel$2(vm) {
  if (vm.mode == 'native') {
    return createPanel(vm);
  } else if (vm.mode == 'slide') {
    return createPanel$1(vm);
  }
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

var warn$3 = log.warn;
var slideApi = {
  emits: ['refresh-activate', 'refresh-before-deactivate', 'refresh-before-deactivate-end', 'refresh-deactivate', 'load-activate', 'load-before-deactivate', 'load-before-deactivate-end', 'load-deactivate'],
  methods: {
    slideScrollTo: function slideScrollTo(x, y, speed, easing) {
      var _this$getPosition = this.getPosition(),
          scrollLeft = _this$getPosition.scrollLeft,
          scrollTop = _this$getPosition.scrollTop;

      x = getNumericValue(x || scrollLeft, this.scroller.__maxScrollLeft);
      y = getNumericValue(y || scrollTop, this.scroller.__maxScrollTop);
      this.scroller.scrollTo(x, y, speed > 0, undefined, false, speed, easing);
    },
    zoomBy: function zoomBy(factor, animate, originLeft, originTop, callback) {
      if (!this.scroller) {
        warn$3('zoomBy and zoomTo are only for slide mode!');
        return;
      }

      this.scroller.zoomBy(factor, animate, originLeft, originTop, callback);
    },
    zoomTo: function zoomTo(level) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var originLeft = arguments.length > 2 ? arguments[2] : undefined;
      var originTop = arguments.length > 3 ? arguments[3] : undefined;
      var callback = arguments.length > 4 ? arguments[4] : undefined;

      if (!this.scroller) {
        warn$3('zoomBy and zoomTo are only for slide mode!');
        return;
      }

      this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
    },
    getCurrentPage: function getCurrentPage() {
      if (!this.scroller || !this.mergedOptions.vuescroll.paging) {
        warn$3('getCurrentPage and goToPage are only for slide mode and paging is enble!');
        return;
      }

      return this.scroller.getCurrentPage();
    },
    goToPage: function goToPage(dest) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.scroller || !this.mergedOptions.vuescroll.paging) {
        warn$3('getCurrentPage and goToPage are only for slide mode and paging is enble!');
        return;
      }

      this.scroller.goToPage(dest, animate);
    },
    triggerRefreshOrLoad: function triggerRefreshOrLoad(type) {
      if (!this.scroller) {
        warn$3('You can only use triggerRefreshOrLoad in slide mode!');
        return;
      }

      var isRefresh = this.mergedOptions.vuescroll.pullRefresh.enable;
      var isLoad = this.mergedOptions.vuescroll.pushLoad.enable;

      if (type == 'refresh' && !isRefresh) {
        warn$3('refresh must be enabled!');
        return;
      } else if (type == 'load' && !isLoad) {
        // eslint-disable-next-line
        warn$3("load must be enabled and content's height > container's height!");
        return;
      } else if (type !== 'refresh' && type !== 'load') {
        warn$3('param must be one of load and refresh!');
        return;
      }
      /* istanbul ignore if */


      if (this.vuescroll.state["".concat(type, "Stage")] == 'start') {
        return;
      }

      this.scroller.triggerRefreshOrLoad(type);
      return true;
    },
    getCurrentviewDomSlide: function getCurrentviewDomSlide() {
      var parent = this.scrollPanelElm;
      var domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};

var api$1 = {
  // mix slide and nitive modes apis.
  mixins: [slideApi, nativeApi],
  methods: {
    // private api
    internalScrollTo: function internalScrollTo(destX, destY, speed, easing) {
      if (this.mode == 'native') {
        this.nativeScrollTo(destX, destY, speed, easing);
      } // for non-native we use scroller's scorllTo
      else if (this.mode == 'slide') {
          this.slideScrollTo(destX, destY, speed, easing);
        }
    },
    stop: function stop() {
      this.nativeStop();
    },
    pause: function pause() {
      this.nativePause();
    },
    "continue": function _continue() {
      this.nativeContinue();
    },
    getCurrentviewDom: function getCurrentviewDom() {
      return this.mode == 'slide' ? this.getCurrentviewDomSlide() : this.getCurrentviewDomNative();
    }
  }
};

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

var time = Date.now || function () {
  return +new Date();
};

var desiredFrames = 60;
var millisecondsPerSecond = 1000;
var running = {};
var counter = 1;
var core = {
  effect: {}
};
var global = null;

if (typeof window !== 'undefined') {
  global = window;
} else {
  global = {};
}

core.effect.Animate = {
  /**
   * A requestAnimationFrame wrapper / polyfill.
   *
   * @param callback {Function} The callback to be invoked before the next repaint.
   * @param root {HTMLElement} The root element for the repaint
   */
  requestAnimationFrame: requestAnimationFrame(global),

  /**
   * Stops the given animation.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation was stopped (aka, was running before)
   */
  stop: function stop(id) {
    var cleared = running[id] != null;

    if (cleared) {
      running[id] = null;
    }

    return cleared;
  },

  /**
   * Whether the given animation is still running.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation is still running
   */
  isRunning: function isRunning(id) {
    return running[id] != null;
  },

  /**
   * Start the animation.
   *
   * @param stepCallback {Function} Pointer to function which is executed on every step.
   *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
   * @param verifyCallback {Function} Executed before every animation step.
   *   Signature of the method should be `function() { return continueWithAnimation; }`
   * @param completedCallback {Function}
   *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
   * @param duration {Integer} Milliseconds to run the animation
   * @param easingMethod {Function} Pointer to easing function
   *   Signature of the method should be `function(percent) { return modifiedValue; }`
   * @param root {Element ? document.body} Render root, when available. Used for internal
   *   usage of requestAnimationFrame.
   * @return {Integer} Identifier of animation. Can be used to stop it any time.
   */
  start: function start(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
    var start = time();
    var lastFrame = start;
    var percent = 0;
    var dropCounter = 0;
    var id = counter++;

    if (!root) {
      root = document.body;
    } // Compacting running db automatically every few new animations


    if (id % 20 === 0) {
      var newRunning = {};

      for (var usedId in running) {
        newRunning[usedId] = true;
      }

      running = newRunning;
    } // This is the internal step method which is called every few milliseconds


    var step = function step(virtual) {
      // Normalize virtual value
      var render = virtual !== true; // Get current time

      var now = time(); // Verification is executed before next animation step

      if (!running[id] || verifyCallback && !verifyCallback(id)) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
        return;
      } // For the current rendering to apply let's update omitted steps in memory.
      // This is important to bring internal state variables up-to-date with progress in time.


      if (render) {
        var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;

        for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
          step(true);
          dropCounter++;
        }
      }

      if (!running[id]) {
        return;
      } // Compute percent value


      if (duration) {
        percent = (now - start) / duration;

        if (percent > 1) {
          percent = 1;
        }
      } // Execute step callback, then...


      var value = easingMethod ? easingMethod(percent) : percent;

      if ((stepCallback(value, now, render) === false || percent === 1) && render) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
      } else if (render) {
        lastFrame = now;
        core.effect.Animate.requestAnimationFrame(step, root);
      }
    }; // Mark as running


    running[id] = true; // Init first step

    core.effect.Animate.requestAnimationFrame(step, root); // Return unique animation ID

    return id;
  }
};

/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * modified by wangyi7099
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */
var animatingMethod = null;
var noAnimatingMethod = null;
function Scroller(callback, options) {
  this.__callback = callback;
  this.options = {
    /** Enable scrolling on x-axis */
    scrollingX: true,

    /** Enable scrolling on y-axis */
    scrollingY: true,

    /** Enable animations for deceleration, snap back, zooming and scrolling */
    animating: true,

    /** duration for animations triggered by scrollTo/zoomTo */
    animationDuration: 250,

    /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
    bouncing: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    },

    /** Enable locking to the main axis if user moves only slightly on one of them at start */
    locking: true,

    /** Enable pagination mode (switching between full page content panes) */
    paging: false,

    /** Enable snapping of content to a configured pixel grid */
    snapping: false,

    /** Enable zooming of content via API, fingers and mouse wheel */
    zooming: false,

    /** Minimum zoom level */
    minZoom: 0.5,

    /** Maximum zoom level */
    maxZoom: 3,

    /** Multiply or decrease scrolling speed **/
    speedMultiplier: 1,

    /** Callback that is fired on the later of touch end or deceleration end,
    provided that another scrolling action has not begun. Used to know
    when to fade out a scrollbar. */
    scrollingComplete: NOOP,
    animatingEasing: 'easeOutCubic',
    noAnimatingEasing: 'easeInOutCubic',

    /** This configures the amount of change applied to deceleration when reaching boundaries  **/
    penetrationDeceleration: 0.03,

    /** This configures the amount of change applied to acceleration when reaching boundaries  **/
    penetrationAcceleration: 0.08
  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  animatingMethod = createEasingFunction(this.options.animatingEasing, easingPattern);
  noAnimatingMethod = createEasingFunction(this.options.noAnimatingEasing, easingPattern);
}
var members = {
  /*
  ---------------------------------------------------------------------------
  INTERNAL FIELDS :: STATUS
  ---------------------------------------------------------------------------
  */

  /** {Boolean} Whether only a single finger is used in touch handling */
  __isSingleTouch: false,

  /** {Boolean} Whether a touch event sequence is in progress */
  __isTracking: false,

  /** {Boolean} Whether a deceleration animation went to completion. */
  __didDecelerationComplete: false,

  /**
   * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
   * a gesturestart event happens. This has higher priority than dragging.
   */
  __isGesturing: false,

  /**
   * {Boolean} Whether the user has moved by such a distance that we have enabled
   * dragging mode. Hint: It's only enabled after some pixels of movement to
   * not interrupt with clicks etc.
   */
  __isDragging: false,

  /**
   * {Boolean} Not touching and dragging anymore, and smoothly animating the
   * touch sequence using deceleration.
   */
  __isDecelerating: false,

  /**
   * {Boolean} Smoothly animating the currently configured change
   */
  __isAnimating: false,

  /*
  ---------------------------------------------------------------------------
  INTERNAL FIELDS :: DIMENSIONS
  ---------------------------------------------------------------------------
  */

  /** {Integer} Available outer left position (from document perspective) */
  __clientLeft: 0,

  /** {Integer} Available outer top position (from document perspective) */
  __clientTop: 0,

  /** {Integer} Available outer width */
  __clientWidth: 0,

  /** {Integer} Available outer height */
  __clientHeight: 0,

  /** {Integer} Outer width of content */
  __contentWidth: 0,

  /** {Integer} Outer height of content */
  __contentHeight: 0,

  /** {Integer} Snapping width for content */
  __snapWidth: 100,

  /** {Integer} Snapping height for content */
  __snapHeight: 100,

  /** {Integer} Height to assign to refresh area */
  __refreshHeight: null,

  /** {Integer} Height to assign to refresh area */
  __loadHeight: null,

  /** {Boolean} Whether the refresh process is enabled when the event is released now */
  __refreshActive: false,

  /** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
  __refreshActivate: null,
  __refreshBeforeDeactivate: null,

  /** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
  __refreshDeactivate: null,

  /** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
  __refreshStart: null,
  __loadActive: null,
  __loadActivate: null,
  __loadBeforeDeactivate: null,
  __loadDeactivate: null,
  __loadStart: null,

  /** {Number} Zoom level */
  __zoomLevel: 1,

  /** {Number} Scroll position on x-axis */
  __scrollLeft: 0,

  /** {Number} Scroll position on y-axis */
  __scrollTop: 0,

  /** {Integer} Maximum allowed scroll position on x-axis */
  __maxScrollLeft: 0,

  /** {Integer} Maximum allowed scroll position on y-axis */
  __maxScrollTop: 0,

  /* {Number} Scheduled left position (final position when animating) */
  __scheduledLeft: 0,

  /* {Number} Scheduled top position (final position when animating) */
  __scheduledTop: 0,

  /* {Number} Scheduled zoom level (final scale when animating) */
  __scheduledZoom: 0,

  /**
   * current page
   */
  __currentPageX: null,
  __currentPageY: null,

  /**
   * total page
   */
  __totalXPage: null,
  __totalYPage: null,

  /*
  ---------------------------------------------------------------------------
  INTERNAL FIELDS :: LAST POSITIONS
  ---------------------------------------------------------------------------
  */

  /** whether the scroller is disabled or not */
  __disable: false,

  /** {Number} Left position of finger at start */
  __lastTouchLeft: null,

  /** {Number} Top position of finger at start */
  __lastTouchTop: null,

  /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
  __lastTouchMove: null,

  /** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
  __positions: null,

  /*
  ---------------------------------------------------------------------------
  INTERNAL FIELDS :: DECELERATION SUPPORT
  ---------------------------------------------------------------------------
  */

  /** {Integer} Minimum left scroll position during deceleration */
  __minDecelerationScrollLeft: null,

  /** {Integer} Minimum top scroll position during deceleration */
  __minDecelerationScrollTop: null,

  /** {Integer} Maximum left scroll position during deceleration */
  __maxDecelerationScrollLeft: null,

  /** {Integer} Maximum top scroll position during deceleration */
  __maxDecelerationScrollTop: null,

  /** {Number} Current factor to modify horizontal scroll position with on every step */
  __decelerationVelocityX: null,

  /** {Number} Current factor to modify vertical scroll position with on every step */
  __decelerationVelocityY: null,

  /*
  ---------------------------------------------------------------------------
  PUBLIC API
  ---------------------------------------------------------------------------
  */

  /**
   * Configures the dimensions of the client (outer) and content (inner) elements.
   * Requires the available space for the outer element and the outer size of the inner element.
   * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
   *
   * @param clientWidth {Integer ? null} Inner width of outer element
   * @param clientHeight {Integer ? null} Inner height of outer element
   * @param contentWidth {Integer ? null} Outer width of inner element
   * @param contentHeight {Integer ? null} Outer height of inner element
   */
  setDimensions: function setDimensions(clientWidth, clientHeight, contentWidth, contentHeight, animate) {
    var noScroll = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var self = this; // Only update values which are defined

    if (clientWidth === +clientWidth) {
      self.__clientWidth = clientWidth;
    }

    if (clientHeight === +clientHeight) {
      self.__clientHeight = clientHeight;
    }

    if (contentWidth === +contentWidth) {
      self.__contentWidth = contentWidth;
    }

    if (contentHeight === +contentHeight) {
      self.__contentHeight = contentHeight;
    } // Refresh maximums


    self.__computeScrollMax();

    if (!noScroll) {
      // Refresh scroll position
      self.scrollTo(self.__scrollLeft, self.__scrollTop, animate);
    }
  },

  /**
   * Sets the client coordinates in relation to the document.
   *
   * @param left {Integer ? 0} Left position of outer element
   * @param top {Integer ? 0} Top position of outer element
   */
  setPosition: function setPosition(left, top) {
    var self = this;
    self.__clientLeft = left || 0;
    self.__clientTop = top || 0;
  },

  /**
   * Configures the snapping (when snapping is active)
   *
   * @param width {Integer} Snapping width
   * @param height {Integer} Snapping height
   */
  setSnapSize: function setSnapSize(width, height) {
    var self = this;
    self.__snapWidth = width;
    self.__snapHeight = height;
  },

  /**
   * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
   * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
   * the official Twitter client.
   *
   * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
   * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
   * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
   * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
   */
  activatePullToRefresh: function activatePullToRefresh(height, _ref) {
    var activateCallback = _ref.activateCallback,
        deactivateCallback = _ref.deactivateCallback,
        startCallback = _ref.startCallback,
        beforeDeactivateCallback = _ref.beforeDeactivateCallback,
        beforeDeactiveEnd = _ref.beforeDeactiveEnd;
    var self = this;
    self.__refreshHeight = height;
    self.__refreshActivate = activateCallback;
    self.__refreshBeforeDeactivate = beforeDeactivateCallback;
    self.__refreshBeforeDeactiveEnd = beforeDeactiveEnd;
    self.__refreshDeactivate = deactivateCallback;
    self.__refreshStart = startCallback;
  },
  activatePushToLoad: function activatePushToLoad(height, _ref2) {
    var activateCallback = _ref2.activateCallback,
        deactivateCallback = _ref2.deactivateCallback,
        startCallback = _ref2.startCallback,
        beforeDeactivateCallback = _ref2.beforeDeactivateCallback,
        beforeDeactiveEnd = _ref2.beforeDeactiveEnd;
    var self = this;
    self.__loadHeight = height;
    self.__loadActivate = activateCallback;
    self.__loadBeforeDeactivate = beforeDeactivateCallback;
    self.__loadBeforeDeactiveEnd = beforeDeactiveEnd;
    self.__loadDeactivate = deactivateCallback;
    self.__loadStart = startCallback;
  },

  /**
   * Starts pull-to-refresh manually.
   */
  triggerRefreshOrLoad: function triggerRefreshOrLoad() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'refresh';
    var wasDecelerating = this.__isDecelerating;

    if (wasDecelerating) {
      core.effect.Animate.stop(wasDecelerating);
      this.__isDecelerating = false;
    } // Use publish instead of scrollTo to allow scrolling to out of boundary position
    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled


    if (type == 'refresh') {
      if (this.__refreshActive || this.__refreshBeforeDeactiveStarted) return;

      this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);

      if (this.__refreshStart) {
        this.__refreshStart();

        this.__refreshActive = true;
      }
    } else if (type == 'load') {
      if (this.__loadActive || this.__loadBeforeDeactiveStarted) return;

      this.__publish(this.__scrollLeft, this.__maxScrollTop + this.__loadHeight, this.__zoomLevel, true);

      if (this.__loadStart) {
        this.__loadStart();

        this.__loadActive = true;
      }
    }
  },

  /**
   * Signalizes that pull-to-refresh is finished.
   */
  finishRefreshOrLoad: function finishRefreshOrLoad() {
    var self = this;

    if (self.__refreshActive) {
      self.__refreshActive = false;

      var endRefreshActive = function endRefreshActive() {
        if (self.__refreshBeforeDeactiveEnd) {
          self.__refreshBeforeDeactiveEnd();
        }

        self.__refreshBeforeDeactiveStarted = true;
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
      };

      if (self.__refreshBeforeDeactivate) {
        self.__refreshBeforeDeactivate(endRefreshActive);
      } else {
        endRefreshActive();
      }
    }

    if (self.__loadActive) {
      self.__loadActive = false;

      var endLoadActive = function endLoadActive() {
        if (self.__loadBeforeDeactiveEnd) {
          self.__loadBeforeDeactiveEnd();
        }

        self.__loadBeforeDeactiveStarted = true;
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
      };

      if (self.__loadBeforeDeactivate) {
        self.__loadBeforeDeactivate(endLoadActive);
      } else {
        endLoadActive();
      }
    }
  },

  /**
   * Returns the scroll position and zooming values
   *
   * @return {Map} `left` and `top` scroll position and `zoom` level
   */
  getValues: function getValues() {
    var self = this;
    return {
      left: self.__scrollLeft,
      top: self.__scrollTop,
      zoom: self.__zoomLevel
    };
  },

  /**
   * Returns the maximum scroll values
   *
   * @return {Map} `left` and `top` maximum scroll values
   */
  getScrollMax: function getScrollMax() {
    var self = this;
    return {
      left: self.__maxScrollLeft,
      top: self.__maxScrollTop
    };
  },

  /**
   * Zooms to the given level. Supports optional animation. Zooms
   * the center when no coordinates are given.
   *
   * @param level {Number} Level to zoom to
   * @param animate {Boolean ? false} Whether to use animation
   * @param originLeft {Number ? null} Zoom in at given left coordinate
   * @param originTop {Number ? null} Zoom in at given top coordinate
   * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
   */
  zoomTo: function zoomTo(level, animate, originLeft, originTop, callback) {
    var self = this;

    if (!self.options.zooming) {
      throw new Error('Zooming is not enabled!');
    } // Add callback if exists


    if (callback) {
      self.__zoomComplete = callback;
    } // Stop deceleration


    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    }

    var oldLevel = self.__zoomLevel; // Normalize input origin to center of viewport if not defined

    if (originLeft == null) {
      originLeft = self.__clientWidth / 2;
    }

    if (originTop == null) {
      originTop = self.__clientHeight / 2;
    } // Limit level according to configuration


    level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom); // Recompute maximum values while temporary tweaking maximum scroll ranges

    self.__computeScrollMax(level); // Recompute left and top coordinates based on new zoom level


    var left = (originLeft + self.__scrollLeft) * level / oldLevel - originLeft;
    var top = (originTop + self.__scrollTop) * level / oldLevel - originTop; // Limit x-axis

    if (left > self.__maxScrollLeft) {
      left = self.__maxScrollLeft;
    } else if (left < 0) {
      left = 0;
    } // Limit y-axis


    if (top > self.__maxScrollTop) {
      top = self.__maxScrollTop;
    } else if (top < 0) {
      top = 0;
    } // Push values out


    self.__publish(left, top, level, animate);
  },

  /**
   * Zooms the content by the given factor.
   *
   * @param factor {Number} Zoom by given factor
   * @param animate {Boolean ? false} Whether to use animation
   * @param originLeft {Number ? 0} Zoom in at given left coordinate
   * @param originTop {Number ? 0} Zoom in at given top coordinate
   * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
   */
  zoomBy: function zoomBy(factor, animate, originLeft, originTop, callback) {
    var self = this;
    self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop, callback);
  },

  /**
   * Scrolls to the given position. Respect limitations and snapping automatically.
   *
   * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
   * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
   * @param animate {Boolean?false} Whether the scrolling should happen using an animation
   * @param zoom {Number?null} Zoom level to go to
   */
  scrollTo: function scrollTo(left, top, animate, zoom, force, speed, easing) {
    var self = this; // Stop deceleration

    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    } // Correct coordinates based on new zoom level


    if (zoom != null && zoom !== self.__zoomLevel) {
      if (!self.options.zooming) {
        throw new Error('Zooming is not enabled!');
      }

      left *= zoom;
      top *= zoom; // Recompute maximum values while temporary tweaking maximum scroll ranges

      self.__computeScrollMax(zoom);
    } else {
      // Keep zoom when not defined
      zoom = self.__zoomLevel;
    }

    if (!self.options.scrollingX && !force) {
      left = self.__scrollLeft;
    } else {
      if (self.options.paging) {
        left = Math.round(left / self.__clientWidth) * self.__clientWidth;
      } else if (self.options.snapping) {
        left = Math.round(left / self.__snapWidth) * self.__snapWidth;
      }
    }

    if (!self.options.scrollingY && !force) {
      top = self.__scrollTop;
    } else {
      if (self.options.paging) {
        top = Math.round(top / self.__clientHeight) * self.__clientHeight;
      } else if (self.options.snapping) {
        top = Math.round(top / self.__snapHeight) * self.__snapHeight;
      }
    }

    if (!force) {
      // Limit for allowed ranges
      left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
      top = Math.max(Math.min(self.__maxScrollTop, top), 0);
    } // Don't animate when no change detected, still call publish to make sure
    // that rendered position is really in-sync with internal data


    if (left === self.__scrollLeft && top === self.__scrollTop) {
      animate = false;
    } // Publish new values


    if (!self.__isTracking) {
      self.__publish(left, top, zoom, animate, speed, easing);
    }
  },

  /**
   * Scroll by the given offset
   *
   * @param left {Number ? 0} Scroll x-axis by given offset
   * @param top {Number ? 0} Scroll x-axis by given offset
   * @param animate {Boolean ? false} Whether to animate the given change
   */
  scrollBy: function scrollBy(left, top, animate) {
    var self = this;
    var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
    var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;
    self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
  },
  getCurrentPage: function getCurrentPage() {
    this.__computePage();

    return {
      x: this.__currentPageX,
      y: this.__currentPageY
    };
  },
  goToPage: function goToPage(_ref3, animate) {
    var x = _ref3.x,
        y = _ref3.y;

    if (isNaN(x)) {
      x = 1;
    }

    if (isNaN(y)) {
      y = 1;
    }

    this.scrollTo((x - 1) * this.__clientWidth, (y - 1) * this.__clientHeight, animate);
  },

  /*
  ---------------------------------------------------------------------------
  EVENT CALLBACKS
  ---------------------------------------------------------------------------
  */

  /**
   * Mouse wheel handler for zooming support
   */
  doMouseZoom: function doMouseZoom(wheelDelta, timeStamp, pageX, pageY) {
    var self = this;
    var change = wheelDelta > 0 ? 0.97 : 1.03;
    return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);
  },

  /**
   * Touch start handler for scrolling support
   */
  doTouchStart: function doTouchStart(touches, timeStamp) {
    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error('Invalid touch list: ' + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }

    if (typeof timeStamp !== 'number') {
      throw new Error('Invalid timestamp value: ' + timeStamp);
    }

    var self = this; // Reset interruptedAnimation flag

    self.__interruptedAnimation = true; // Stop deceleration

    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
      self.__interruptedAnimation = true;
    } // Stop animation


    if (self.__isAnimating) {
      core.effect.Animate.stop(self.__isAnimating);
      self.__isAnimating = false;
      self.__interruptedAnimation = true;
    } // Use center point when dealing with two fingers


    var currentTouchLeft, currentTouchTop;
    var isSingleTouch = touches.length === 1;

    if (isSingleTouch) {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    } else {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    } // Store initial positions


    self.__initialTouchLeft = currentTouchLeft;
    self.__initialTouchTop = currentTouchTop; // Store current zoom level

    self.__zoomLevelStart = self.__zoomLevel; // Store initial touch positions

    self.__lastTouchLeft = currentTouchLeft;
    self.__lastTouchTop = currentTouchTop; // Store initial move time stamp

    self.__lastTouchMove = timeStamp; // Reset initial scale

    self.__lastScale = 1; // Reset locking flags

    self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
    self.__enableScrollY = !isSingleTouch && self.options.scrollingY; // Reset tracking flag

    self.__isTracking = true; // Reset deceleration complete flag

    self.__didDecelerationComplete = false; // Dragging starts directly with two fingers, otherwise lazy with an offset

    self.__isDragging = !isSingleTouch; // Some features are  in multi touch scenarios

    self.__isSingleTouch = isSingleTouch; // Clearing data structure

    self.__positions = [];
  },

  /**
   * Touch move handler for scrolling support
   */
  doTouchMove: function doTouchMove(touches, timeStamp, scale) {
    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error('Invalid touch list: ' + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }

    if (typeof timeStamp !== 'number') {
      throw new Error('Invalid timestamp value: ' + timeStamp);
    }

    var self = this; // Ignore event when tracking is not enabled (event might be outside of element)

    if (!self.__isTracking) {
      return;
    }

    var currentTouchLeft, currentTouchTop; // Compute move based around of center of fingers

    if (touches.length === 2) {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    } else {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    }

    var positions = self.__positions; // Are we already is dragging mode?

    if (self.__isDragging) {
      // Compute move distance
      var moveX = currentTouchLeft - self.__lastTouchLeft;
      var moveY = currentTouchTop - self.__lastTouchTop; // Read previous scroll position and zooming

      var scrollLeft = self.__scrollLeft;
      var scrollTop = self.__scrollTop;
      var level = self.__zoomLevel; // Work with scaling

      if (scale != null && self.options.zooming) {
        var oldLevel = level; // Recompute level based on previous scale and new scale

        level = level / self.__lastScale * scale; // Limit level according to configuration

        level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom); // Only do further compution when change happened

        if (oldLevel !== level) {
          // Compute relative event position to container
          var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
          var currentTouchTopRel = currentTouchTop - self.__clientTop; // Recompute left and top coordinates based on new zoom level

          scrollLeft = (currentTouchLeftRel + scrollLeft) * level / oldLevel - currentTouchLeftRel;
          scrollTop = (currentTouchTopRel + scrollTop) * level / oldLevel - currentTouchTopRel; // Recompute max scroll values

          self.__computeScrollMax(level);
        }
      }

      var bouncing = self.options.bouncing;

      if (self.__enableScrollX) {
        scrollLeft -= moveX * this.options.speedMultiplier;
        var maxScrollLeft = self.__maxScrollLeft;

        if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
          scrollLeft += moveX / 2 * this.options.speedMultiplier; // fix scrollLeft

          scrollLeft = Math.min(Math.max(-bouncing.left, scrollLeft), maxScrollLeft + bouncing.right);
        }
      } // Compute new vertical scroll position


      if (self.__enableScrollY) {
        scrollTop -= moveY * this.options.speedMultiplier;
        var maxScrollTop = self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < 0) {
          scrollTop += moveY / 2 * this.options.speedMultiplier; // fix scrollTop

          scrollTop = Math.min(Math.max(-bouncing.top, scrollTop), maxScrollTop + bouncing.bottom); // Trigger pull to refresh or push to load

          if (!self.__enableScrollX && (self.__refreshHeight != null || self.__loadHeight != null)) {
            if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
              self.__refreshActive = true;

              if (self.__refreshActivate) {
                self.__refreshActivate();
              }
            } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
              self.__refreshActive = false;

              if (self.__refreshDeactivate) {
                self.__refreshDeactivate();
              }
            } // handle for push-load
            else if (!self.__loadActive && scrollTop >= self.__maxScrollTop + self.__loadHeight && self.__loadHeight > 0) {
                self.__loadActive = true;

                if (self.__loadActivate) {
                  self.__loadActivate();
                }
              } else if (self.__loadActive && scrollTop < self.__maxScrollTop + self.__loadHeight) {
                self.__loadActive = false;

                if (self.__loadDeactivate) {
                  self.__loadDeactivate();
                }
              }
          }
        }
      } // Keep list from growing infinitely (holding min 10, max 20 measure points)


      if (positions.length > 60) {
        positions.splice(0, 30);
      } // Track scroll movement for decleration


      positions.push(scrollLeft, scrollTop, timeStamp); // Sync scroll position

      self.__publish(scrollLeft, scrollTop, level); // Otherwise figure out whether we are switching into dragging mode now.

    } else {
      var minimumTrackingForScroll = self.options.locking ? 3 : 0;
      var minimumTrackingForDrag = 5;
      var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
      var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
      self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
      self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
      positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);
      self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

      if (self.__isDragging) {
        self.__interruptedAnimation = false;
      }
    } // Update last touch positions and time stamp for next event


    self.__lastTouchLeft = currentTouchLeft;
    self.__lastTouchTop = currentTouchTop;
    self.__lastTouchMove = timeStamp;
    self.__lastScale = scale;
  },

  /**
   * Touch end handler for scrolling support
   */
  doTouchEnd: function doTouchEnd(timeStamp) {
    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }

    if (typeof timeStamp !== 'number') {
      throw new Error('Invalid timestamp value: ' + timeStamp);
    }

    var self = this; // Ignore event when tracking is not enabled (no touchstart event on element)
    // This is required as this listener ('touchmove') sits on the document and not on the element itself.

    if (!self.__isTracking) {
      return;
    } // Not touching anymore (when two finger hit the screen there are two touch end events)


    self.__isTracking = false; // Be sure to reset the dragging flag now. Here we also detect whether
    // the finger has moved fast enough to switch into a deceleration animation.

    if (self.__isDragging) {
      // Reset dragging flag
      self.__isDragging = false; // Start deceleration
      // Verify that the last move detected was in some relevant time frame

      if (self.__isSingleTouch && self.options.animating && timeStamp - self.__lastTouchMove <= 100) {
        // Then figure out what the scroll position was about 100ms ago
        var positions = self.__positions;
        var endPos = positions.length - 1;
        var startPos = endPos; // Move pointer to position measured 100ms ago

        for (var i = endPos; i > 0 && positions[i] > self.__lastTouchMove - 100; i -= 3) {
          startPos = i;
        } // If start and stop position is identical in a 100ms timeframe,
        // we cannot compute any useful deceleration.


        if (startPos !== endPos) {
          // Compute relative movement between these two points
          var timeOffset = positions[endPos] - positions[startPos];
          var movedLeft = self.__scrollLeft - positions[startPos - 2];
          var movedTop = self.__scrollTop - positions[startPos - 1]; // Based on 50ms compute the movement to apply for each render step

          self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
          self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60); // How much velocity is required to start the deceleration

          var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1; // Verify that we have enough velocity to start deceleration

          if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
            // Deactivate pull-to-refresh when decelerating
            if (!self.__refreshActive && !self.__loadActive) {
              self.__startDeceleration(timeStamp);
            }
          } else {
            self.__scrollComplete();
          }
        } else {
          self.__scrollComplete();
        }
      } else if (timeStamp - self.__lastTouchMove > 100) {
        self.__scrollComplete();
      }
    } // If this was a slower move it is per default non decelerated, but this
    // still means that we want snap back to the bounds which is done here.
    // This is placed outside the condition above to improve edge case stability
    // e.g. touchend fired without enabled dragging. This should normally do not
    // have modified the scroll positions or even showed the scrollbars though.


    if (!self.__isDecelerating) {
      if (self.__refreshActive && self.__refreshStart) {
        // Use publish instead of scrollTo to allow scrolling to out of boundary position
        // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
        self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);

        if (self.__refreshStart) {
          self.__refreshStart();
        }
      } else if (self.__loadActive && self.__loadStart) {
        // Use publish instead of scrollTo to allow scrolling to out of boundary position
        // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
        self.__publish(self.__scrollLeft, self.__maxScrollTop + self.__loadHeight, self.__zoomLevel, true);

        if (self.__loadStart) {
          self.__loadStart();
        }
      } else {
        if (self.__interruptedAnimation || self.__isDragging) {
          self.__scrollComplete();
        }

        self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel); // Directly signalize deactivation (nothing todo on refresh?)

        if (self.__refreshActive) {
          self.__refreshActive = false;

          if (self.__refreshDeactivate) {
            self.__refreshDeactivate();
          }
        } else if (self.__loadActive) {
          self.__loadActive = false;

          if (self.__loadDeactivate) {
            self.__loadDeactivate();
          }
        }
      }
    } // Fully cleanup list


    self.__positions.length = 0;
  },

  /** Handle for scroll/publish */
  onScroll: NOOP,
  stop: function stop() {
    var self = this;
    self.__disable = true;
  },
  start: function start() {
    var self = this;
    self.__disable = true;
  },

  /*
  ---------------------------------------------------------------------------
  PRIVATE API
  ---------------------------------------------------------------------------
  */

  /**
   * Applies the scroll position to the content element
   *
   * @param left {Number} Left scroll position
   * @param top {Number} Top scroll position
   * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
   */
  __publish: function __publish(left, top, zoom, animate, speed, easing) {
    var self = this;

    if (self.__disable) {
      return;
    }

    if (isNaN(left)) {
      left = this.__scrollLeft;
    }

    if (isNaN(top)) {
      top = this.__scrollTop;
    } // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation


    var wasAnimating = self.__isAnimating;

    if (wasAnimating) {
      core.effect.Animate.stop(wasAnimating);
      self.__isAnimating = false;
    }

    if (animate && (self.options.animating || speed)) {
      // Keep scheduled positions for scrollBy/zoomBy functionality
      self.__scheduledLeft = left;
      self.__scheduledTop = top;
      self.__scheduledZoom = zoom;
      var oldLeft = self.__scrollLeft;
      var oldTop = self.__scrollTop;
      var oldZoom = self.__zoomLevel;
      var diffLeft = left - oldLeft;
      var diffTop = top - oldTop;
      var diffZoom = zoom - oldZoom;

      var step = function step(percent, now, render) {
        if (render) {
          self.__scrollLeft = oldLeft + diffLeft * percent;
          self.__scrollTop = oldTop + diffTop * percent;
          self.__zoomLevel = oldZoom + diffZoom * percent; // Push values out

          if (self.__callback) {
            self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);

            self.onScroll();
          }
        }
      };

      var verify = function verify(id) {
        return self.__isAnimating === id;
      };

      var completed = function completed(renderedFramesPerSecond, animationId, wasFinished) {
        if (animationId === self.__isAnimating) {
          self.__isAnimating = false;
        }

        if (self.__didDecelerationComplete || wasFinished) {
          self.__scrollComplete();
        }

        if (self.options.zooming) {
          self.__computeScrollMax();

          if (self.__zoomComplete) {
            self.__zoomComplete();

            self.__zoomComplete = null;
          }
        }

        if (self.__refreshBeforeDeactiveStarted) {
          self.__refreshBeforeDeactiveStarted = false;
          if (self.__refreshDeactivate) self.__refreshDeactivate();
        }

        if (self.__loadBeforeDeactiveStarted) {
          self.__loadBeforeDeactiveStarted = false;
          if (self.__loadDeactivate) self.__loadDeactivate();
        }
      };

      var easingFunction = animatingMethod;

      if (easing) {
        easingFunction = createEasingFunction(easing, easingPattern);
      } // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out


      self.__isAnimating = core.effect.Animate.start(step, verify, completed, speed || self.options.animationDuration, wasAnimating ? easingFunction : noAnimatingMethod);
    } else {
      self.__scheduledLeft = self.__scrollLeft = left;
      self.__scheduledTop = self.__scrollTop = top;
      self.__scheduledZoom = self.__zoomLevel = zoom; // Push values out

      if (self.__callback) {
        self.__callback(left, top, zoom);

        self.onScroll();
      } // Fix max scroll ranges


      if (self.options.zooming) {
        self.__computeScrollMax();

        if (self.__zoomComplete) {
          self.__zoomComplete();

          self.__zoomComplete = null;
        }
      }

      if (self.__refreshBeforeDeactiveStarted) {
        self.__refreshBeforeDeactiveStarted = false;
        if (self.__refreshDeactivate) self.__refreshDeactivate();
      }

      if (self.__loadBeforeDeactiveStarted) {
        self.__loadBeforeDeactiveStarted = false;
        if (self.__loadDeactivate) self.__loadDeactivate();
      }
    }
  },

  /**
   * Recomputes scroll minimum values based on client dimensions and content dimensions.
   */
  __computeScrollMax: function __computeScrollMax(zoomLevel) {
    var self = this;

    if (zoomLevel == null) {
      zoomLevel = self.__zoomLevel;
    }

    self.__maxScrollLeft = Math.max(self.__contentWidth * zoomLevel - self.__clientWidth, 0);
    self.__maxScrollTop = Math.max(self.__contentHeight * zoomLevel - self.__clientHeight, 0);
  },

  /** compute current page total page */
  __computePage: function __computePage() {
    var self = this;
    var clientWidth = self.__clientWidth;
    var clientHeight = self.__clientHeight;
    var left = self.__scrollLeft;
    var top = self.__scrollTop;
    self.__totalXPage = Math.ceil(self.__contentWidth / clientWidth);
    self.__currentPageX = Math.ceil(left / clientWidth + 1);
    self.__totalYPage = Math.ceil(self.__contentHeight / clientHeight);
    self.__currentPageY = Math.ceil(top / clientHeight + 1);
  },

  /** complete scroll*/
  __scrollComplete: function __scrollComplete() {
    var self = this;
    self.options.scrollingComplete();
  },

  /*
  ---------------------------------------------------------------------------
  ANIMATION (DECELERATION) SUPPORT
  ---------------------------------------------------------------------------
  */

  /**
   * Called when a touch sequence end and the speed of the finger was high enough
   * to switch into deceleration mode.
   */
  __startDeceleration: function __startDeceleration() {
    var self = this;

    if (self.options.paging) {
      var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
      var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
      var clientWidth = self.__clientWidth;
      var clientHeight = self.__clientHeight; // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
      // Each page should have exactly the size of the client area.

      self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
      self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
      self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
      self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
    } else {
      self.__minDecelerationScrollLeft = 0;
      self.__minDecelerationScrollTop = 0;
      self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
      self.__maxDecelerationScrollTop = self.__maxScrollTop;
    } // Wrap class method


    var step = function step(percent, now, render) {
      self.__stepThroughDeceleration(render);
    }; // How much velocity is required to keep the deceleration running


    var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.001; // Detect whether it's still worth to continue animating steps
    // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.

    var verify = function verify() {
      var shouldContinue = Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;

      if (!shouldContinue) {
        self.__didDecelerationComplete = true;
      }

      return shouldContinue;
    };

    var completed = function completed() {
      if (!self.__isDecelerating) {
        return;
      }

      self.__isDecelerating = false;

      if (self.__didDecelerationComplete) {
        self.__scrollComplete();
      } // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions


      self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
    }; // Start animation and switch on flag


    self.__isDecelerating = core.effect.Animate.start(step, verify, completed);
  },

  /**
   * Called on every step of the animation
   *
   * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
   */
  __stepThroughDeceleration: function __stepThroughDeceleration(render) {
    var self = this;
    var bouncing = self.options.bouncing;
    var minLeft = self.__minDecelerationScrollLeft;
    var maxLeft = self.__maxDecelerationScrollLeft;
    var minTop = self.__minDecelerationScrollTop;
    var maxTop = self.__maxDecelerationScrollTop; // Add deceleration to scroll position

    var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
    var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
    var bounceX = scrollLeft < minLeft || scrollLeft > maxLeft;
    var bounceY = scrollTop < minTop || scrollTop > maxTop; // fix scrollLeft and scrollTop

    var fixedScrollLeft = Math.min(Math.max(minLeft - bouncing.left, scrollLeft), maxLeft + bouncing.right);
    var fixedScrollTop = Math.min(Math.max(minTop - bouncing.top, scrollTop), maxTop + bouncing.bottom); //
    // UPDATE SCROLL POSITION
    //

    if (render) {
      self.__publish(fixedScrollLeft, fixedScrollTop, self.__zoomLevel);
    } else {
      self.__scrollLeft = scrollLeft;
      self.__scrollTop = scrollTop;
    } //
    // SLOW DOWN
    //
    // Slow down velocity on every iteration


    if (!self.options.paging) {
      // This is the factor applied to every iteration of the animation
      // to slow down the process. This should emulate natural behavior where
      // objects slow down when the initiator of the movement is removed
      var frictionFactor = 0.95;
      self.__decelerationVelocityX *= frictionFactor;
      self.__decelerationVelocityY *= frictionFactor;
    } //
    // BOUNCING SUPPORT
    //


    var scrollOutsideX = 0;
    var scrollOutsideY = 0; // This configures the amount of change applied to deceleration/acceleration when reaching boundaries

    var penetrationDeceleration = self.options.penetrationDeceleration;
    var penetrationAcceleration = self.options.penetrationAcceleration;

    if (bounceX) {
      // Check limits
      if (scrollLeft < self.__minDecelerationScrollLeft) {
        scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
      } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
        scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
      }
    }

    if (bounceY) {
      if (scrollTop < self.__minDecelerationScrollTop) {
        scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
      } else if (scrollTop > self.__maxDecelerationScrollTop) {
        scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
      }
    }

    if (scrollOutsideX !== 0) {
      if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
        self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;

        if (scrollOutsideX < 0 && -scrollOutsideX >= bouncing.right && self.__decelerationVelocityX > 0) {
          self.__decelerationVelocityX = -bouncing.right / 2;
        }

        if (scrollOutsideX > 0 && scrollOutsideX >= bouncing.left && self.__decelerationVelocityX < 0) {
          self.__decelerationVelocityX = bouncing.left / 2;
        }
      } else {
        self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
      }
    }

    if (scrollOutsideY !== 0) {
      if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
        self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;

        if (scrollOutsideY < 0 && -scrollOutsideY >= bouncing.bottom && self.__decelerationVelocityY > 0) {
          self.__decelerationVelocityY = -bouncing.bottom / 2;
        }

        if (scrollOutsideY > 0 && scrollOutsideY >= bouncing.top && self.__decelerationVelocityY < 0) {
          self.__decelerationVelocityY = bouncing.top / 2;
        }
      } else {
        self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration / 2;
      }
    }
  }
}; // Copy over members to prototype

for (var key in members) {
  Scroller.prototype[key] = members[key];
}

/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */

function render(content, global, suffix, type) {
  if (type == 'position') {
    return function (left, top) {
      content.style.left = -left + 'px';
      content.style.top = -top + 'px';
    };
  }

  var vendorPrefix = getPrefix(global);
  var helperElem = document.createElement('div');
  var undef;
  var perspectiveProperty = vendorPrefix + 'Perspective';
  var transformProperty = 'transform'; //vendorPrefix + 'Transform';

  if (helperElem.style[perspectiveProperty] !== undef) {
    return function (left, top, zoom) {
      content.style[transformProperty] = 'translate3d(' + -left + suffix + ',' + -top + suffix + ',0) scale(' + zoom + ')';
    };
  } else if (helperElem.style[transformProperty] !== undef) {
    return function (left, top, zoom) {
      content.style[transformProperty] = 'translate(' + -left + suffix + ',' + -top + suffix + ') scale(' + zoom + ')';
    };
  }
}

var touch = new TouchManager();
function listenContainer(container, scroller, eventCallback, zooming, preventDefault, preventDefaultOnMove) {
  var destroy = null;
  var mousedown = false;
  var touchObj = touch.getTouchObject();

  function touchstart(e) {
    var event = touch.getEventObject(e); // Don't react if initial down happens on a form element

    if (event[0] && event[0].target && event[0].target.tagName.match(/input|textarea|select/i) || scroller.__disable) {
      return;
    }

    eventCallback('mousedown');
    mousedown = true;
    scroller.doTouchStart(event, e.timeStamp);

    if (preventDefault) {
      e.preventDefault();
    }

    e.stopPropagation(); // here , we want to manully prevent default, so we
    // set passive to false
    // see https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener

    document.addEventListener(touchObj._touchmove, touchmove, {
      passive: false
    });
  }

  function touchmove(e) {
    if (scroller.__disable || !mousedown) return;
    var event = touch.getEventObject(e);
    eventCallback('mousemove');
    scroller.doTouchMove(event, e.timeStamp, e.scale);

    if (preventDefaultOnMove) {
      e.preventDefault();
    }
  }

  function touchend(e) {
    eventCallback('mouseup');
    mousedown = false;
    scroller.doTouchEnd(e.timeStamp);
    document.removeEventListener(touchObj._touchmove, touchmove);
  }

  function touchcancel(e) {
    scroller.doTouchEnd(e.timeStamp);
  }

  function zoomHandle(e) {
    scroller.doMouseZoom(e.detail ? e.detail * -120 : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
  }

  container.addEventListener(touchObj._touchstart, touchstart, false);
  document.addEventListener(touchObj._touchend, touchend, false);
  document.addEventListener(touchObj._touchcancel, touchcancel, false);

  if (zooming && !touch.isTouch) {
    container.addEventListener(navigator.userAgent.indexOf('Firefox') > -1 ? 'DOMMouseScroll' : 'mousewheel', zoomHandle, false);
  }

  destroy = function destroy() {
    container.removeEventListener(touchObj._touchstart, touchstart, false);
    document.removeEventListener(touchObj._touchend, touchend, false);
    document.removeEventListener(touchObj._touchcancel, touchcancel, false);
    container.removeEventListener(navigator.userAgent.indexOf('Firefox') > -1 ? 'DOMMouseScroll' : 'mousewheel', zoomHandle, false);
  }; // handle __publish event


  scroller.onScroll = function () {
    eventCallback('onscroll');
  };

  return destroy;
}

createSlideModeStyle();
/**
 * @description refresh and load callback
 */

function createStateCallbacks(type, stageType, vm, tipDom) {
  var listeners = vm.$.vnode.props;

  var activateCallback = function activateCallback() {
    vm.vuescroll.state[stageType] = 'active';
    vm.$emit(type + '-activate', vm, tipDom);
  };

  var deactivateCallback = function deactivateCallback() {
    vm.vuescroll.state[stageType] = 'deactive';
    vm.$emit(type + '-deactivate', vm, tipDom);
  };

  var beforeDeactiveEnd = function beforeDeactiveEnd() {
    vm.vuescroll.state[stageType] = 'beforeDeactiveEnd';
    vm.$emit(type + '-before-deactivate-end', vm, tipDom);
  };

  var startCallback = function startCallback() {
    vm.vuescroll.state[stageType] = 'start';
    setTimeout(function () {
      vm.scroller.finishRefreshOrLoad();
    }, 2000); // Default start stage duration
  };

  var beforeDeactivateCallback;

  function hasListens(event) {
    var listenrWholeName = "on".concat(upperFirstChar(type)).concat(upperFirstChar(event));
    return !!listeners[listenrWholeName];
  }
  /* istanbul ignore if */


  if (hasListens('beforeDeactivate')) {
    beforeDeactivateCallback = function beforeDeactivateCallback(done) {
      vm.vuescroll.state[stageType] = 'beforeDeactive';
      vm.$emit(type + '-before-deactivate', vm, tipDom, done.bind(vm.scroller));
    };
  }
  /* istanbul ignore if */


  if (hasListens('start')) {
    startCallback = function startCallback() {
      vm.vuescroll.state[stageType] = 'start';
      vm.$emit(type + '-start', vm, tipDom, vm.scroller.finishRefreshOrLoad.bind(vm.scroller));
    };
  }

  return {
    activateCallback: activateCallback,
    deactivateCallback: deactivateCallback,
    startCallback: startCallback,
    beforeDeactivateCallback: beforeDeactivateCallback,
    beforeDeactiveEnd: beforeDeactiveEnd
  };
}

var slideMix = {
  mounted: function mounted() {
    this.vsMounted = true;
  },
  computed: {
    pullRefreshTip: function pullRefreshTip() {
      return this.mergedOptions.vuescroll.pullRefresh.tips[this.vuescroll.state.refreshStage];
    },
    pushLoadTip: function pushLoadTip() {
      return this.mergedOptions.vuescroll.pushLoad.tips[this.vuescroll.state.loadStage];
    },
    refreshLoad: function refreshLoad() {
      return this.mergedOptions.vuescroll.pullRefresh.enable || this.mergedOptions.vuescroll.pushLoad.enable;
    },
    refrehDomVisiable: function refrehDomVisiable() {
      return this.vsMounted && this.outTheTopBoundary;
    },
    loadDomVisiable: function loadDomVisiable() {
      return this.vsMounted && this.outTheBottomBoundary;
    }
  },
  data: function data() {
    return {
      vuescroll: {
        state: {
          /** Default tips of refresh and load */
          refreshStage: 'deactive',
          loadStage: 'deactive'
        }
      },
      vsMounted: false,
      outTheTopBoundary: false,
      outTheBottomBoundary: false
    };
  },
  methods: {
    // Update:
    // 1. update height/width
    // 2. update refresh or load
    updateScroller: function updateScroller() {
      this.updateDimesion();
      this.registryRefreshLoad();
    },
    updateDimesion: function updateDimesion() {
      var clientWidth = this.$el.clientWidth;
      var clientHeight = this.$el.clientHeight;
      var contentWidth = this.scrollPanelElm.scrollWidth;
      var contentHeight = this.scrollPanelElm.scrollHeight;
      var refreshHeight = 0;
      var loadHeight = 0; // If the refresh option is true,let's  give a "margin-top" style to
      // the refresh-tip dom. let it to be invisible when doesn't trigger
      // refresh.

      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        if (this.vsMounted) {
          var refreshDom = this.$refs[__REFRESH_DOM_NAME].elm || this.$refs[__REFRESH_DOM_NAME];
          refreshHeight = refreshDom.offsetHeight;
          refreshDom.style.marginTop = -refreshHeight + 'px';
        }
      }

      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        if (this.vsMounted) {
          var loadDom = this.$refs[__LOAD_DOM_NAME].elm || this.$refs[__LOAD_DOM_NAME];
          loadHeight = loadDom.offsetHeight;
          contentHeight -= loadHeight;
          loadDom.style.bottom = "-".concat(loadHeight, "px");
        }
      }

      if (this.scroller) {
        this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight, false);
      }
    },
    registryRefreshLoad: function registryRefreshLoad() {
      // registry refresh
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        this.registryEvent('refresh');
      } // registry load


      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        this.registryEvent('load');
      }
    },
    registryScroller: function registryScroller() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? 0 : _ref$left,
          _ref$top = _ref.top,
          top = _ref$top === void 0 ? 0 : _ref$top,
          _ref$zoom = _ref.zoom,
          zoom = _ref$zoom === void 0 ? 1 : _ref$zoom;

      var _this$mergedOptions$v = this.mergedOptions.vuescroll.scroller,
          preventDefault = _this$mergedOptions$v.preventDefault,
          preventDefaultOnMove = _this$mergedOptions$v.preventDefaultOnMove;
      var _this$mergedOptions$v2 = this.mergedOptions.vuescroll,
          paging = _this$mergedOptions$v2.paging,
          snapping = _this$mergedOptions$v2.snapping.enable,
          renderMethod = _this$mergedOptions$v2.renderMethod,
          zooming = _this$mergedOptions$v2.zooming,
          locking = _this$mergedOptions$v2.locking; // disale zooming when refresh or load enabled

      zooming = !this.refreshLoad && !paging && !snapping && zooming;
      var _this$mergedOptions$s = this.mergedOptions.scrollPanel,
          scrollingY = _this$mergedOptions$s.scrollingY,
          scrollingX = _this$mergedOptions$s.scrollingX;
      var scrollingComplete = this.scrollingComplete.bind(this); // Initialize Scroller

      this.scroller = new Scroller(render(this.scrollPanelElm, window, 'px', renderMethod), _objectSpread2(_objectSpread2({}, this.mergedOptions.vuescroll.scroller), {}, {
        zooming: zooming,
        scrollingY: scrollingY,
        scrollingX: scrollingX && !this.refreshLoad,
        animationDuration: this.mergedOptions.scrollPanel.speed,
        paging: paging,
        snapping: snapping,
        scrollingComplete: scrollingComplete,
        locking: locking
      }));
      this.scroller.__disable = this.mergedOptions.vuescroll.scroller.disable;
      this.scroller.__scrollLeft = left;
      this.scroller.__scrollTop = top;
      this.scroller.__zoomLevel = zoom; // Set snap

      if (snapping) {
        this.scroller.setSnapSize(this.mergedOptions.vuescroll.snapping.width, this.mergedOptions.vuescroll.snapping.height);
      }

      var rect = this.$el.getBoundingClientRect();
      this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop); // Get destroy callback

      var cb = listenContainer(this.$el, this.scroller, function (eventType) {
        // Thie is to dispatch the event from the scroller.
        // to let vuescroll refresh the dom
        switch (eventType) {
          case 'mousedown':
            _this.vuescroll.state.isDragging = true;
            break;

          case 'onscroll':
            {
              /**
               * Trigger auto load
               */
              var stage = _this.vuescroll.state['loadStage'];
              var _this$mergedOptions$v3 = _this.mergedOptions.vuescroll.pushLoad,
                  enable = _this$mergedOptions$v3.enable,
                  auto = _this$mergedOptions$v3.auto,
                  autoLoadDistance = _this$mergedOptions$v3.autoLoadDistance;
              var _this$scroller = _this.scroller,
                  __scrollTop = _this$scroller.__scrollTop,
                  __maxScrollTop = _this$scroller.__maxScrollTop;

              if (stage != 'start' && enable && auto && !_this.lockAutoLoad && // auto load debounce
              autoLoadDistance >= __maxScrollTop - __scrollTop && __scrollTop > 0) {
                _this.lockAutoLoad = true;

                _this.triggerRefreshOrLoad('load');
              }

              if (autoLoadDistance < __maxScrollTop - __scrollTop) {
                _this.lockAutoLoad = false;
              }

              _this.handleScroll(false);
            }
            break;

          case 'mouseup':
            _this.vuescroll.state.isDragging = false;
            break;
        }
      }, zooming, preventDefault, preventDefaultOnMove);
      this.updateScroller();
      return cb;
    },
    updateSlideModeBarState: function updateSlideModeBarState() {
      // update slide mode scrollbars' state
      var heightPercentage, widthPercentage;
      var vuescroll = this.$el;
      var scroller = this.scroller;
      var outerLeft = 0;
      var outerTop = 0;
      var _this$$el = this.$el,
          clientWidth = _this$$el.clientWidth,
          clientHeight = _this$$el.clientHeight;
      var contentWidth = clientWidth + this.scroller.__maxScrollLeft;
      var contentHeight = clientHeight + this.scroller.__maxScrollTop; // We should add the the height or width that is
      // out of horizontal bountry  to the total length

      /* istanbul ignore if */

      if (scroller.__scrollLeft < 0) {
        outerLeft = -scroller.__scrollLeft;
      }
      /* istanbul ignore next */
      else if (scroller.__scrollLeft > scroller.__maxScrollLeft) {
          outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
        } // out of vertical bountry


      if (scroller.__scrollTop < 0) {
        outerTop = -scroller.__scrollTop;
        this.outTheBottomBoundary = false;
        this.outTheTopBoundary = true;
      } else if (scroller.__scrollTop > scroller.__maxScrollTop) {
        outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
        this.outTheTopBoundary = false;
        this.outTheBottomBoundary = true;
      } else {
        this.outTheTopBoundary = this.outTheBottomBoundary = false;
      }

      heightPercentage = clientHeight / (contentHeight + outerTop);
      widthPercentage = clientWidth / (contentWidth + outerLeft);
      var scrollTop = Math.min(Math.max(0, scroller.__scrollTop), scroller.__maxScrollTop);
      var scrollLeft = Math.min(Math.max(0, scroller.__scrollLeft), scroller.__maxScrollLeft);
      this.bar.vBar.state.posValue = (scrollTop + outerTop) * 100 / vuescroll.clientHeight;
      this.bar.hBar.state.posValue = (scrollLeft + outerLeft) * 100 / vuescroll.clientWidth;
      /* istanbul ignore if */

      if (scroller.__scrollLeft < 0) {
        this.bar.hBar.state.posValue = 0;
      }

      if (scroller.__scrollTop < 0) {
        this.bar.vBar.state.posValue = 0;
      }

      this.bar.vBar.state.size = heightPercentage < 1 ? heightPercentage : 0;
      this.bar.hBar.state.size = widthPercentage < 1 ? widthPercentage : 0;
    },
    registryEvent: function registryEvent(type) {
      var domName = type == 'refresh' ? __REFRESH_DOM_NAME : __LOAD_DOM_NAME;
      var activateFunc = type == 'refresh' ? this.scroller.activatePullToRefresh : this.scroller.activatePushToLoad;
      var stageType = type == 'refresh' ? 'refreshStage' : 'loadStage';
      var tipDom = this.$refs[domName].elm || this.$refs[domName];
      var cbs = createStateCallbacks(type, stageType, this, tipDom);
      var height = tipDom.offsetHeight;
      activateFunc.bind(this.scroller)(height, cbs);
    },
    getSlidePosition: function getSlidePosition() {
      return {
        scrollLeft: this.scroller.__scrollLeft,
        scrollTop: this.scroller.__scrollTop
      };
    }
  }
};

/**
 * These mixes is exclusive for native mode
 */
var nativeMix = {
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
      var scrollable = false;
      if (e.ctrlKey) return false; // check mouse point scrollable.

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
          locking = _this$mergedOptions$v.locking,
          deltaPercent = _this$mergedOptions$v.deltaPercent;
      var deltaX;
      var deltaY;

      if (event.wheelDelta) {
        if (event.deltaY || event.deltaX) {
          deltaX = event.deltaX * deltaPercent;
          deltaY = event.deltaY * deltaPercent;

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

var update = [slideMix, nativeMix];

var mixins = [api$1].concat(_toConsumableArray(update));

var core$1 = {
  mixins: mixins,
  mounted: function mounted() {
    var _this = this;

    if (!this._isDestroyed && !this.renderError) {
      if (this.mode == 'slide') {
        this.updatedCbs.push(this.updateScroller);
      }

      this.$watch(function () {
        return _this.mergedOptions.vuescroll.scroller.disable;
      }, function (newVal) {
        if (_this.scroller) {
          _this.scroller.__disable = newVal;
        }
      }, {
        flush: 'sync'
      });
    }
  },
  computed: {
    mode: function mode() {
      return this.mergedOptions.vuescroll.mode;
    }
  },
  methods: {
    destroy: function destroy() {
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      /* istanbul ignore next */


      if (this.destroyResize) {
        this.destroyResize();
      }
    },
    handleScroll: function handleScroll(nativeEvent) {
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    updateBarStateAndEmitEvent: function updateBarStateAndEmitEvent(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.mode == 'native') {
        this.updateNativeModeBarState();
      } else if (this.mode == 'slide') {
        /* istanbul ignore if */
        if (!this.scroller) {
          return;
        }

        this.updateSlideModeBarState();
      }

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
    getScrollProcess: function getScrollProcess() {
      var _this$scrollPanelElm = this.scrollPanelElm,
          scrollHeight = _this$scrollPanelElm.scrollHeight,
          scrollWidth = _this$scrollPanelElm.scrollWidth,
          clientHeight = _this$scrollPanelElm.clientHeight,
          clientWidth = _this$scrollPanelElm.clientWidth,
          scrollTop = _this$scrollPanelElm.scrollTop,
          scrollLeft = _this$scrollPanelElm.scrollLeft;

      if (this.mode == 'slide') {
        scrollHeight = this.scroller.__contentHeight;
        scrollWidth = this.scroller.__contentWidth;
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
        clientHeight = this.$el.clientHeight;
        clientWidth = this.$el.clientWidth;
      }

      var v = Math.min(scrollTop / (scrollHeight - clientHeight || 1), 1);
      var h = Math.min(scrollLeft / (scrollWidth - clientWidth || 1), 1);
      return {
        v: v,
        h: h
      };
    },
    emitEvent: function emitEvent(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$scrollPanelElm2 = this.scrollPanelElm,
          scrollTop = _this$scrollPanelElm2.scrollTop,
          scrollLeft = _this$scrollPanelElm2.scrollLeft;
      var vertical = {
        type: 'vertical'
      };
      var horizontal = {
        type: 'horizontal'
      };

      var _this$getScrollProces = this.getScrollProcess(),
          v = _this$getScrollProces.v,
          h = _this$getScrollProces.h;

      vertical['process'] = v;
      horizontal['process'] = h;
      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    initVariables: function initVariables() {
      this.lastMode = this.mode;
      this.$el._isVuescroll = true;
    },
    refreshMode: function refreshMode() {
      var initPos;

      if (this.scroller) {
        initPos = this.scroller.getValues();
      }

      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }

      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller(initPos);
      } else if (this.mode == 'native') {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = '';
        this.scrollPanelElm.style.transformOrigin = '';
      }
    },
    refreshInternalStatus: function refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize(); // 2. registry resize event

      this.registryResize(); // 3. registry scroller if mode is 'slide'
      // or remove 'transform origin' is the mode is not `slide`

      this.refreshMode(); // 4. update scrollbar's height/width

      this.updateBarStateAndEmitEvent('refresh-status');
    },
    registryResize: function registryResize() {
      var _this2 = this;

      var resizeEnable = this.mergedOptions.vuescroll.detectResize;
      var modeChanged = false;

      if (this.lastMode != this.mode) {
        modeChanged = true;
        this.lastMode = this.mode;
      }
      /* istanbul ignore next */


      if (this.destroyResize && resizeEnable && !modeChanged) {
        return;
      }

      if (this.destroyResize) {
        this.destroyResize();
      }

      if (!resizeEnable) {
        return;
      }

      var contentElm = null;

      if (this.mode == 'slide') {
        contentElm = this.scrollPanelElm;
      } else if (this.mode == 'native') {
        // scrollContent maybe a vue-component or a pure-dom
        contentElm = this.scrollContentElm;
      }

      var vm = this;

      var handleWindowResize = function handleWindowResize()
      /* istanbul ignore next */
      {
        vm.updateBarStateAndEmitEvent('window-resize');

        if (vm.mode == 'slide') {
          vm.updatedCbs.push(vm.updateScroller);
          vm.$forceUpdate();
        }
      };

      var handleDomResize = function handleDomResize() {
        var currentSize = {};

        if (_this2.mode == 'slide') {
          currentSize['width'] = _this2.scroller.__contentWidth;
          currentSize['height'] = _this2.scroller.__contentHeight;

          _this2.updateBarStateAndEmitEvent('handle-resize', currentSize); // update scroller should after rendering


          _this2.updatedCbs.push(_this2.updateScroller);

          _this2.$forceUpdate();
        } else if (_this2.mode == 'native') {
          currentSize['width'] = _this2.scrollPanelElm.scrollWidth;
          currentSize['height'] = _this2.scrollPanelElm.scrollHeight;

          _this2.updateBarStateAndEmitEvent('handle-resize', currentSize);
        } // Since content sie changes, we should tell parent to set
        // correct size to fit content's size


        _this2.setVsSize();
      };

      window.addEventListener('resize', handleWindowResize, false);
      var destroyDomResize = installResizeDetection(contentElm, handleDomResize);

      var destroyWindowResize = function destroyWindowResize() {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = function () {
        destroyWindowResize();
        destroyDomResize();
        _this2.destroyResize = null;
      };
    },
    getPosition: function getPosition() {
      if (this.mode == 'slide') {
        return this.getSlidePosition();
      } else if (this.mode == 'native') {
        return this.getNativePosition();
      }
    }
  }
};

/**
 * The slide mode config
 */
var error = log.error;
var configs = [{
  // vuescroll
  vuescroll: {
    // position or transform
    renderMethod: 'transform',
    // pullRefresh or pushLoad is only for the slide mode...
    pullRefresh: {
      enable: false,
      tips: {
        deactive: 'Pull to Refresh',
        active: 'Release to Refresh',
        start: 'Refreshing...',
        beforeDeactive: 'Refresh Successfully!'
      }
    },
    pushLoad: {
      enable: false,
      tips: {
        deactive: 'Push to Load',
        active: 'Release to Load',
        start: 'Loading...',
        beforeDeactive: 'Load Successfully!'
      },
      auto: false,
      autoLoadDistance: 0
    },
    paging: false,
    zooming: true,
    snapping: {
      enable: false,
      width: 100,
      height: 100
    },

    /* some scroller options */
    scroller: {
      /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
      bouncing: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      },

      /** Minimum zoom level */
      minZoom: 0.5,

      /** Maximum zoom level */
      maxZoom: 3,

      /** Multiply or decrease scrolling speed **/
      speedMultiplier: 1,

      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration: 0.03,

      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration: 0.08,

      /** Whether call e.preventDefault event when sliding the content or not */
      preventDefault: false,

      /** Whether call preventDefault when (mouse/touch)move*/
      preventDefaultOnMove: true,
      disable: false
    }
  }
}];
/**
 * validate the options
 * @export
 * @param {any} ops
 */

function configValidator(ops) {
  var renderError = false;
  var vuescroll = ops.vuescroll; // validate pushLoad, pullReresh, snapping

  if (vuescroll.paging == vuescroll.snapping.enable && vuescroll.paging && (vuescroll.pullRefresh || vuescroll.pushLoad)) {
    error('paging, snapping, (pullRefresh with pushLoad) can only one of them to be true.');
  }

  return renderError;
}

var configs$1 = [{
  vuescroll: {
    wheelScrollDuration: 0,
    wheelDirectionReverse: false,
    checkShiftKey: true,
    deltaPercent: 1
  }
}];

var error$1 = log.error;
var config = {
  // vuescroll
  vuescroll: {
    mode: 'native'
  }
};
/**
 * validate the options
 * @export
 * @param {any} ops
 */

function configValidator$1(ops) {
  var renderError = false;
  var vuescroll = ops.vuescroll; // validate modes

  if (!~modes.indexOf(vuescroll.mode)) {
    error$1("Unknown mode: ".concat(vuescroll.mode, ",the vuescroll's option \"mode\" should be one of the ").concat(modes));
    renderError = true;
  }

  return renderError;
}

var configs$2 = [config].concat(_toConsumableArray(configs), _toConsumableArray(configs$1));
var configValidators = [configValidator$1, configValidator];

var Vuescroll = _objectSpread2({
  scrollTo: scrollTo
}, _install(core$1, createPanel$2, configs$2, configValidators));

export default Vuescroll;
