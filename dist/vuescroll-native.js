/*
    * Vuescroll v4.9.0-beta.4
    * (c) 2018-2018 Yi(Yves) Wang
    * Released under the MIT License
    * Github: https://github.com/YvesCoding/vuescroll
    * Website: http://vuescrolljs.yvescoding.org/
    */
   
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
	typeof define === 'function' && define.amd ? define(['vue'], factory) :
	(global.vuescroll = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
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
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* istanbul ignore next */
var isServer = function isServer() {
  return Vue.prototype.$isServer;
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
    get: function get$$1() {
      return source[souceKey];
    },

    configurable: true
  });
}



var scrollBarWidth = void 0;
function getGutter() {
  /* istanbul ignore next */
  if (isServer()) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  var outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  var offsetWidth = outer.offsetWidth,
      clientWidth = outer.clientWidth;


  scrollBarWidth = offsetWidth - clientWidth;

  document.body.removeChild(outer);
  return scrollBarWidth;
}

function eventCenter(dom, eventName, hander) {
  var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'on';

  type == 'on' ? dom.addEventListener(eventName, hander, capture) : dom.removeEventListener(eventName, hander, capture);
}


var warn = function warn(msg) {
  console.warn('[vuescroll] ' + msg);
};

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

function isSupportTouch() {
  /* istanbul ignore if */
  if (isServer()) return false;
  return 'ontouchstart' in window;
}

function getPrefix(global) {
  var docStyle = document.documentElement.style;
  var engine;
  /* istanbul ignore if */
  if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
    engine = 'presto';
  } /* istanbul ignore next */else if ('MozAppearance' in docStyle) {
      engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
      engine = 'webkit';
    } /* istanbul ignore next */else if (typeof navigator.cpuClass === 'string') {
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

  var compatibleValue = '-' + getPrefix(window) + '-' + value;
  var testElm = document.createElement('div');
  testElm.style[property] = compatibleValue;
  if (testElm.style[property] == compatibleValue) {
    return compatibleValue;
  }
  /* istanbul ignore next */
  return false;
}

function isIE() {
  /* istanbul ignore if */
  if (isServer()) return false;

  var agent = navigator.userAgent.toLowerCase();
  return agent.indexOf('msie') !== -1 || agent.indexOf('trident') !== -1 || agent.indexOf(' edge/') !== -1;
}

/**
 * Insert children into user-passed slot at vnode level
 */
function insertChildrenIntoSlot(h) {
  var parentVnode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var childVNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var swapChildren = arguments[4];

  /* istanbul ignore if */
  if (parentVnode && parentVnode.length > 1) {
    return swapChildren ? [].concat(toConsumableArray(childVNode), toConsumableArray(parentVnode)) : [].concat(toConsumableArray(parentVnode), toConsumableArray(childVNode));
  }

  parentVnode = parentVnode[0];

  var _getVnodeInfo = getVnodeInfo(parentVnode),
      ch = _getVnodeInfo.ch,
      tag = _getVnodeInfo.tag,
      isComponent = _getVnodeInfo.isComponent;

  if (isComponent) {
    parentVnode.data = mergeObject({ attrs: parentVnode.componentOptions.propsData }, parentVnode.data, false, // force: false
    true // shallow: true
    );
  }
  ch = swapChildren ? [].concat(toConsumableArray(childVNode), toConsumableArray(ch)) : [].concat(toConsumableArray(ch), toConsumableArray(childVNode));
  delete parentVnode.data.slot;

  return h(tag, mergeObject(data, parentVnode.data, false, true), ch);
}

/**
 *  Get the info of a vnode,
 * vnode must be parentVnode
 */
function getVnodeInfo(vnode) {
  if (!vnode || vnode.length > 1) return {};

  vnode = vnode[0] ? vnode[0] : vnode;
  var isComponent = !!vnode.componentOptions;
  var ch = void 0;
  var tag = void 0;

  if (isComponent) {
    ch = vnode.componentOptions.children || [];
    tag = vnode.componentOptions.tag;
  } else {
    ch = vnode.children || [];
    tag = vnode.tag;
  }

  return {
    isComponent: isComponent,
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
  if (!parent._isVuescrollRoot && parent) {
    parent = parent.$parent;
  }
  return parent;
}

var isArray = function isArray(_) {
  return Array.isArray(_);
};
var isPlainObj = function isPlainObj(_) {
  return Object.prototype.toString.call(_) == '[object Object]';
};
var isUndef = function isUndef(_) {
  return typeof _ === 'undefined';
};

function getNumericValue(distance, size) {
  var number = void 0;
  if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = size * number / 100;
  }
  return number;
}

var api = {
  mounted: function mounted() {
    vsInstances[this._uid] = this;
  },
  beforeDestroy: function beforeDestroy() {
    delete vsInstances[this._uid];
  },

  methods: {
    // public api
    scrollTo: function scrollTo(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.internalScrollTo(x, y, animate, force);
    },
    scrollBy: function scrollBy(_ref2) {
      var _ref2$dx = _ref2.dx,
          dx = _ref2$dx === undefined ? 0 : _ref2$dx,
          _ref2$dy = _ref2.dy,
          dy = _ref2$dy === undefined ? 0 : _ref2$dy;
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _vuescroll$state = this.vuescroll.state,
          _vuescroll$state$inte = _vuescroll$state.internalScrollLeft,
          internalScrollLeft = _vuescroll$state$inte === undefined ? 0 : _vuescroll$state$inte,
          _vuescroll$state$inte2 = _vuescroll$state.internalScrollTop,
          internalScrollTop = _vuescroll$state$inte2 === undefined ? 0 : _vuescroll$state$inte2;

      if (dx) {
        internalScrollLeft += getNumericValue(dx, this.scrollPanelElm.scrollWidth - this.$el.clientWidth);
      }
      if (dy) {
        internalScrollTop += getNumericValue(dy, this.scrollPanelElm.scrollHeight - this.$el.clientHeight);
      }
      this.internalScrollTo(internalScrollLeft, internalScrollTop, animate);
    },
    scrollIntoView: function scrollIntoView(elm) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var parentElm = this.$el;

      if (typeof elm === 'string') {
        elm = parentElm.querySelector(elm);
      }

      if (!isChildInParent(elm, parentElm)) {
        warn('The element or selector you passed is not the element of Vuescroll, please pass the element that is in Vuescroll to scrollIntoView API. ');
        return;
      }

      // parent elm left, top

      var _$el$getBoundingClien = this.$el.getBoundingClientRect(),
          left = _$el$getBoundingClien.left,
          top = _$el$getBoundingClien.top;
      // child elm left, top


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
      this.refreshInternalStatus();
      // refresh again to keep status is correct
      this.$nextTick(this.refreshInternalStatus);
    },

    // Get the times you have scrolled!
    getScrollingTimes: function getScrollingTimes() {
      return this.vuescroll.state.scrollingTimes;
    },

    // Clear the times you have scrolled!
    clearScrollingTimes: function clearScrollingTimes() {
      this.vuescroll.state.scrollingTimes = 0;
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
    var callbackHandle = rafHandle++;

    // Store callback
    requests[callbackHandle] = callback;
    if (intervalHandle === null) {
      intervalHandle = setInterval(function () {
        var time = +new Date();
        var currentRequests = requests;

        // Reset data structure before executing callbacks
        requests = {};
        for (var key in currentRequests) {
          if (currentRequests.hasOwnProperty(key)) {
            currentRequests[key](time);
            lastActive = time;
          }
        }

        // Disable the timeout when nothing happens for a certain
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

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
var time = Date.now || function () {
  return +new Date();
};
var desiredFrames = 60;
var millisecondsPerSecond = 1000;
var running = {};
var counter = 1;

var core = { effect: {} };
var global$1 = null;

if (typeof window !== 'undefined') {
  global$1 = window;
} else {
  global$1 = {};
}

core.effect.Animate = {
  /**
   * A requestAnimationFrame wrapper / polyfill.
   *
   * @param callback {Function} The callback to be invoked before the next repaint.
   * @param root {HTMLElement} The root element for the repaint
   */
  requestAnimationFrame: requestAnimationFrame(global$1),
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
    }

    // Compacting running db automatically every few new animations
    if (id % 20 === 0) {
      var newRunning = {};
      for (var usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    // This is the internal step method which is called every few milliseconds
    var step = function step(virtual) {
      // Normalize virtual value
      var render = virtual !== true;

      // Get current time
      var now = time();

      // Verification is executed before next animation step
      if (!running[id] || verifyCallback && !verifyCallback(id)) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
        return;
      }

      // For the current rendering to apply let's update omitted steps in memory.
      // This is important to bring internal state variables up-to-date with progress in time.
      if (render) {
        var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
        for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
          step(true);
          dropCounter++;
        }
      }

      // Compute percent value
      if (duration) {
        percent = (now - start) / duration;
        if (percent > 1) {
          percent = 1;
        }
      }

      // Execute step callback, then...
      var value = easingMethod ? easingMethod(percent) : percent;
      if ((stepCallback(value, now, render) === false || percent === 1) && render) {
        running[id] = null;
        completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
      } else if (render) {
        lastFrame = now;
        core.effect.Animate.requestAnimationFrame(step, root);
      }
    };

    // Mark as running
    running[id] = true;

    // Init first step
    core.effect.Animate.requestAnimationFrame(step, root);

    // Return unique animation ID
    return id;
  }
};

var baseConfig = {
  // vuescroll
  vuescroll: {
    // vuescroll's size(height/width) should be a percent(100%)
    // or be a number that is equal to its parentNode's width or
    // height ?
    sizeStrategy: 'percent',
    /** Whether to detect dom resize or not */
    detectResize: true
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
    verticalNativeBarPos: 'right'
  },

  //
  rail: {
    background: '#01a99a',
    opacity: 0,
    /** Rail's size(Height/Width) , default -> 6px */
    size: '6px',
    /** Specify rail and bar's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
    specifyBorderRadius: false,
    /** Rail the distance from the two ends of the X axis and Y axis. **/
    gutterOfEnds: '2px',
    /** Rail the distance from the side of container. **/
    gutterOfSide: '2px',
    /** Whether to keep rail show or not, default -> false, event content height is not enough */
    keepShow: false
  },
  bar: {
    /** How long to hide bar after mouseleave, default -> 500 */
    showDelay: 500,
    /** Whether to show bar on scrolling, default -> true */
    onlyShowBarOnScroll: true,
    /** Whether to keep show or not, default -> false */
    keepShow: false,
    /** Bar's background , default -> #00a650 */
    background: 'rgb(3, 185, 118)',
    /** Bar's opacity, default -> 1  */
    opacity: 1,
    /** Styles when you hover scrollbar, it will merge into the current style */
    hoverStyle: false
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
      hRail = _ops$rail.hRail;

  // validate scrollPanel

  var initialScrollY = scrollPanel['initialScrollY'];
  var initialScrollX = scrollPanel['initialScrollX'];

  if (initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
    warn('The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.');
  }
  if (initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
    warn('The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.');
  }

  // validate deprecated vBar/hBar vRail/hRail
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

// do nothing

// some small changes.
var smallChangeArray = ['mergedOptions.vuescroll.pullRefresh.tips', 'mergedOptions.vuescroll.pushLoad.tips', 'mergedOptions.rail', 'mergedOptions.bar'];
// refresh/load dom ref/key...

// detect content size change
function installResizeDetection(element, callback) {
  return injectObject(element, callback);
}

function injectObject(element, callback) {
  if (element.hasResized) {
    return;
  }

  var OBJECT_STYLE = 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;';
  // define a wrap due to ie's zIndex bug
  var objWrap = document.createElement('div');
  objWrap.style.cssText = OBJECT_STYLE;
  var object = document.createElement('object');
  object.style.cssText = OBJECT_STYLE;
  object.type = 'text/html';
  object.tabIndex = -1;
  object.onload = function () {
    eventCenter(object.contentDocument.defaultView, 'resize', callback);
  };
  // https://github.com/wnr/element-resize-detector/blob/aafe9f7ea11d1eebdab722c7c5b86634e734b9b8/src/detection-strategy/object.js#L159
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
    axis: 'Y'
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
    axis: 'X'
  }
};

var colorCache = {};
var rgbReg = /rgb\(/;
var extractRgbColor = /rgb\((.*)\)/;

/* istanbul ignore next */
function createMouseEvent(ctx) {
  var parent = getRealParent(ctx);

  function mousedown(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    document.onselectstart = function () {
      return false;
    };
    ctx.axisStartPos = e[ctx.bar.client] - ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName];

    // Tell parent that the mouse has been down.
    ctx.$emit('setBarDrag', true);
    eventCenter(document, 'mousemove', mousemove);
    eventCenter(document, 'mouseup', mouseup);
  }

  function mousemove(e) {
    if (!ctx.axisStartPos) {
      return;
    }

    var delta = e[ctx.bar.client] - ctx.$el.getBoundingClientRect()[ctx.bar.posName];
    var percent = (delta - ctx.axisStartPos) / ctx.$el[ctx.bar.offset];
    parent.scrollTo(defineProperty({}, ctx.bar.axis.toLowerCase(), parent.scrollPanelElm[ctx.bar.scrollSize] * percent), false);
  }

  function mouseup() {
    ctx.$emit('setBarDrag', false);
    parent.hideBar();

    document.onselectstart = null;
    ctx.axisStartPos = 0;

    eventCenter(document, 'mousemove', mousemove, false, 'off');
    eventCenter(document, 'mouseup', mouseup, false, 'off');
  }

  return mousedown;
}

/* istanbul ignore next */
function createTouchEvent(ctx) {
  var parent = getRealParent(ctx);

  function touchstart(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    document.onselectstart = function () {
      return false;
    };

    ctx.axisStartPos = e.touches[0][ctx.bar.client] - ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName];

    // Tell parent that the mouse has been down.
    ctx.$emit('setBarDrag', true);
    eventCenter(document, 'touchmove', touchmove);
    eventCenter(document, 'touchend', touchend);
  }
  function touchmove(e) {
    if (!ctx.axisStartPos) {
      return;
    }

    var delta = e.touches[0][ctx.bar.client] - ctx.$el.getBoundingClientRect()[ctx.bar.posName];
    var percent = (delta - ctx.axisStartPos) / ctx.$el[ctx.bar.offset];

    parent.scrollTo(defineProperty({}, ctx.bar.axis.toLowerCase(), parent.scrollPanelElm[ctx.bar.scrollSize] * percent), false);
  }
  function touchend() {
    ctx.$emit('setBarDrag', false);
    parent.hideBar();

    document.onselectstart = null;
    ctx.axisStartPos = 0;

    eventCenter(document, 'touchmove', touchmove, false, 'off');
    eventCenter(document, 'touchend', touchend, false, 'off');
  }
  return touchstart;
}

// Transform a common color int oa `rgbA` color
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

  return colorCache[id] = 'rgba(' + extractRgbColor.exec(computedColor)[1] + ', ' + opacity + ')';
}

function createTrackEvent(ctx, type) {
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
    var event = type == 'touchstart' ? e.touches[0] : e;

    var percent = (event[client] - e.currentTarget.getBoundingClientRect()[posName] - barOffset / 2) / (e.currentTarget[offset] - barOffset);

    parent.scrollTo(defineProperty({}, axis.toLowerCase(), percent * 100 + '%'));
  };
}

var bar = {
  name: 'bar',
  props: {
    ops: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    hideBar: {
      type: Boolean
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    bar: function bar() {
      return scrollMap[this.type];
    }
  },
  render: function render(h) {
    var _style, _style2;

    var vm = this;

    /** Scrollbar style */
    var style = (_style = {}, defineProperty(_style, vm.bar.size, vm.state.size), defineProperty(_style, 'background', vm.ops.bar.background), defineProperty(_style, 'opacity', vm.state.opacity), defineProperty(_style, 'transform', 'translate' + scrollMap[vm.type].axis + '(' + vm.state.posValue + '%)'), _style);
    var bar = {
      style: style,
      class: '__bar-is-' + vm.type,
      ref: 'thumb',
      on: {}
    };

    var originBarStyle = {};
    var hoverBarStyle = vm.ops.bar.hoverStyle;
    if (hoverBarStyle) {
      bar.on['mouseenter'] = function () {
        /* istanbul ignore next */
        if (!hoverBarStyle) return;

        Object.keys(hoverBarStyle).forEach(function (key) {
          originBarStyle[key] = vm.$refs.thumb.style[key];
        });

        mergeObject(hoverBarStyle, vm.$refs.thumb.style, true);
      };
      bar.on['mouseleave'] = function () {
        /* istanbul ignore next */
        if (!hoverBarStyle) return;

        Object.keys(hoverBarStyle).forEach(function (key) {
          vm.$refs.thumb.style[key] = originBarStyle[key];
        });
      };
    }

    /** Get rgbA format background color */
    var railBackgroundColor = getRgbAColor(vm.ops.rail.background, vm.ops.rail.opacity);

    /** Rail Data */
    var rail = {
      class: '__rail-is-' + vm.type,
      style: (_style2 = {
        borderRadius: vm.ops.rail.specifyBorderRadius || vm.ops.rail.size,
        background: railBackgroundColor
      }, defineProperty(_style2, vm.bar.opsSize, vm.ops.rail.size), defineProperty(_style2, vm.bar.posName, vm.ops.rail['gutterOfEnds']), defineProperty(_style2, vm.bar.opposName, vm.ops.rail['gutterOfEnds']), defineProperty(_style2, vm.bar.sidePosName, vm.ops.rail['gutterOfSide']), _style2),
      on: {}
    };

    /* istanbul ignore if */
    if (isSupportTouch()) {
      bar.on['touchstart'] = createTouchEvent(this);
      rail.on['touchstart'] = createTrackEvent(this, 'touchstart');
    } else {
      bar.on['mousedown'] = createMouseEvent(this);
      rail.on['mousedown'] = createTrackEvent(this, 'mousedown');
    }

    return h(
      'div',
      rail,
      [this.hideBar ? null : h('div', bar)]
    );
  }
};

/**
 * create bars
 *
 * @param {any} size
 * @param {any} type
 */
function createBar(h, vm, type) {
  var axis = scrollMap[type].axis;
  /** type.charAt(0) = vBar/hBar */
  var barType = type.charAt(0) + 'Bar';

  var hideBar = !vm.bar[barType].state.size || !vm.mergedOptions.scrollPanel['scrolling' + axis] || vm.refreshLoad && type !== 'vertical';

  var keepShowRail = vm.mergedOptions.rail.keepShow;

  if (hideBar && !keepShowRail) {
    return null;
  }

  var barData = {
    props: {
      type: type,
      ops: {
        bar: vm.mergedOptions.bar,
        rail: vm.mergedOptions.rail
      },
      state: vm.bar[barType].state,
      hideBar: hideBar
    },
    on: {
      setBarDrag: vm.setBarDrag
    },
    ref: type + 'Bar'
  };

  return h('bar', barData);
}

/**
 * This is like a HOC, It extracts the common parts of the
 * native-mode, slide-mode and mix-mode.
 * Each mode must implement the following methods:
 * 1. refreshInternalStatus : use to refresh the component
 * 2. recordCurrentPos : use the record the current scroll postion.
 * 3. destroy : Destroy some registryed events before component destroy.
 * 4. updateBarStateAndEmitEvent: use to update bar states and emit events.
 */

var withBase = function withBase(_ref) {
  var _render = _ref.render,
      name = _ref.name,
      components = _ref.components,
      mixins = _ref.mixins,
      Vue$$1 = _ref.Vue;

  return Vue$$1.component(name || 'vue-scroll', {
    props: {
      ops: { type: Object }
    },
    components: components,
    mixins: [api].concat(toConsumableArray([].concat(mixins))),
    created: function created() {
      var _this = this;

      /**
       * Begin to merge options
       */

      var _gfc = mergeObject(this.$vuescrollConfig || {}, {});
      var ops = mergeObject(baseConfig, _gfc);

      this.$options.propsData.ops = this.$options.propsData.ops || {};
      Object.keys(this.$options.propsData.ops).forEach(function (key) {
        {
          defineReactive(_this.mergedOptions, key, _this.$options.propsData.ops);
        }
      });
      // from ops to mergedOptions
      mergeObject(ops, this.mergedOptions);

      this._isVuescrollRoot = true;
      this.renderError = validateOps(this.mergedOptions);
    },
    render: function render(h) {
      var vm = this;
      if (vm.renderError) {
        return h('div', [[vm.$slots['default']]]);
      }

      // vuescroll data
      var data = {
        style: {
          height: vm.vuescroll.state.height,
          width: vm.vuescroll.state.width,
          padding: 0
        },
        class: '__vuescroll'
      };

      if (!isSupportTouch()) {
        data.on = {
          mouseenter: function mouseenter() {
            vm.vuescroll.state.pointerLeave = false;
            vm.updateBarStateAndEmitEvent();
          },
          mouseleave: function mouseleave() {
            vm.vuescroll.state.pointerLeave = true;
            vm.hideBar();
          },
          mousemove: function mousemove() /* istanbul ignore next */{
            vm.vuescroll.state.pointerLeave = false;
            vm.updateBarStateAndEmitEvent();
          }
        };
      } /* istanbul ignore next */else {
          data.on = {
            touchstart: function touchstart() {
              vm.vuescroll.state.pointerLeave = false;
              vm.updateBarStateAndEmitEvent();
            },
            touchend: function touchend() {
              vm.vuescroll.state.pointerLeave = true;
              vm.hideBar();
            },
            touchmove: function touchmove() /* istanbul ignore next */{
              vm.vuescroll.state.pointerLeave = false;
              vm.updateBarStateAndEmitEvent();
            }
          };
        }

      var ch = [_render(h, vm), createBar(h, vm, 'vertical'), createBar(h, vm, 'horizontal')];

      var _customContainer = this.$slots['scroll-container'];
      if (_customContainer) {
        return insertChildrenIntoSlot(h, _customContainer, ch, data);
      }

      return h(
        'div',
        data,
        [ch]
      );
    },
    mounted: function mounted() {
      var _this2 = this;

      if (!this.renderError) {
        this.initVariables();
        this.initWatchOpsChange();
        // Call external merged Api
        this.refreshInternalStatus();

        this.updatedCbs.push(function () {
          _this2.scrollToAnchor();
          _this2.updateBarStateAndEmitEvent();
        });
      }
    },
    updated: function updated() {
      var _this3 = this;

      this.updatedCbs.forEach(function (cb) {
        cb.call(_this3);
      });
      // Clear
      this.updatedCbs = [];
    },
    beforeDestroy: function beforeDestroy() {
      // remove registryed resize event
      if (this.destroyParentDomResize) {
        this.destroyParentDomResize();
        this.destroyParentDomResize = null;
      }

      if (this.destroy) {
        this.destroy();
      }
    },


    /** ------------------------------- Computed ----------------------------- */
    computed: {
      scrollPanelElm: function scrollPanelElm() {
        return this.$refs['scrollPanel']._isVue ? this.$refs['scrollPanel'].$el : this.$refs['scrollPanel'];
      }
    },
    data: function data() {
      return {
        vuescroll: {
          state: {
            isDragging: false,
            pointerLeave: true,
            /** Internal states to record current positions */
            internalScrollTop: 0,
            internalScrollLeft: 0,
            /** Current scrolling directions */
            posX: null,
            posY: null,
            /** Default sizeStrategies */
            height: '100%',
            width: '100%',
            /** How many times you have scrolled */
            scrollingTimes: 0
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
        renderError: false
      };
    },

    /** ------------------------------- Methods -------------------------------- */
    methods: {
      /** ------------------------ Handlers --------------------------- */
      handleScroll: function handleScroll(nativeEvent) {
        this.recordCurrentPos();
        this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
      },
      scrollingComplete: function scrollingComplete() {
        this.vuescroll.state.scrollingTimes++;
        this.updateBarStateAndEmitEvent('handle-scroll-complete');
      },
      setBarDrag: function setBarDrag(val) {
        /* istanbul ignore next */
        this.vuescroll.state.isDragging = val;
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
        // when in non-native mode dragging content
        // in slide mode, just return
        /* istanbul ignore next */
        if (this.vuescroll.state.isDragging) {
          return;
        }

        if (forceHideBar && !this.mergedOptions.bar.keepShow) {
          this.bar.hBar.state.opacity = 0;
          this.bar.vBar.state.opacity = 0;
        }

        // add isDragging condition
        // to prevent from hiding bar while dragging the bar
        if (!this.mergedOptions.bar.keepShow && !this.vuescroll.state.isDragging && this.vuescroll.state.pointerLeave) {
          this.bar.vBar.state.opacity = 0;
          this.bar.hBar.state.opacity = 0;
        }
      },
      useNumbericSize: function useNumbericSize() {
        var _this5 = this;

        this.usePercentSize();
        setTimeout(function () {
          var el = _this5.$el;
          _this5.vuescroll.state.height = el.offsetHeight + 'px';
          _this5.vuescroll.state.width = el.offsetWidth + 'px';
        }, 0);
      },
      usePercentSize: function usePercentSize() {
        this.vuescroll.state.height = '100%';
        this.vuescroll.state.width = '100%';
      },

      // Set its size to be equal to its parentNode
      setVsSize: function setVsSize() {
        if (this.destroyParentDomResize) {
          this.destroyParentDomResize();
          this.destroyParentDomResize = null;
        }

        if (this.mergedOptions.vuescroll.sizeStrategy == 'number') {
          this.useNumbericSize();
          this.registryParentResize();
        } else if (this.mergedOptions.vuescroll.sizeStrategy == 'percent') {
          this.usePercentSize();
        }
      },


      /** ------------------------ Init --------------------------- */
      initWatchOpsChange: function initWatchOpsChange() {
        var _this6 = this;

        var watchOpts = {
          deep: true,
          sync: true
        };
        this.$watch('mergedOptions', function () {
          // record current position
          _this6.recordCurrentPos();
          setTimeout(function () {
            if (_this6.isSmallChangeThisTick) {
              _this6.isSmallChangeThisTick = false;
              _this6.updateBarStateAndEmitEvent('options-change');
              return;
            }
            _this6.refreshInternalStatus();
          }, 0);
        }, watchOpts);

        /**
         * We also watch `small` changes, and when small changes happen, we send
         * a signal to vuescroll, to tell it:
         * 1. we don't need to registry resize
         * 2. we don't need to registry scroller.
         */
        smallChangeArray.forEach(function (opts) {
          _this6.$watch(opts, function () {
            _this6.isSmallChangeThisTick = true;
          }, watchOpts);
        });
      },

      // scrollTo hash-anchor while mounted component have mounted.
      scrollToAnchor: function scrollToAnchor() /* istanbul ignore next */{
        var validateHashSelector = function validateHashSelector(hash) {
          return (/^#[a-zA-Z_]\d*$/.test(hash)
          );
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
      },


      /** ------------------------ Registry Resize --------------------------- */

      registryParentResize: function registryParentResize() {
        var resizeEnable = this.mergedOptions.vuescroll.detectResize;
        this.destroyParentDomResize = resizeEnable ? installResizeDetection(this.$el.parentNode, this.useNumbericSize) : function () {};
      }
    }
  });
};

/**
 * Start to scroll to a position
 */
function goScrolling(x, y, startLocationX, startLocationY, maxX, maxY, speed, easing, scrollingComplete, render) {
  // deltaX,
  // deltaY,
  var deltaX = x - startLocationX;
  var deltaY = y - startLocationY;
  var positionX = startLocationX;
  var positionY = startLocationY;
  /**
   * keep the limit of scroll delta.
   */
  /* istanbul ignore next */
  if (startLocationY + deltaY < 0) {
    deltaY = -startLocationY;
  }
  if (startLocationY + deltaY > maxX) {
    deltaY = maxY - startLocationY;
  }
  if (startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if (startLocationX + deltaX > maxY) {
    deltaX = maxX - startLocationX;
  }

  var easingMethod = createEasingFunction(easing, easingPattern);

  var stepCallback = function stepCallback(percentage) {
    positionX = startLocationX + deltaX * percentage;
    positionY = startLocationY + deltaY * percentage;
    render(Math.floor(positionX), Math.floor(positionY));
  };

  var verifyCallback = function verifyCallback() {
    return Math.abs(positionY - startLocationY) <= Math.abs(deltaY) || Math.abs(positionX - startLocationX) <= Math.abs(deltaX);
  };

  core.effect.Animate.start(stepCallback, verifyCallback, scrollingComplete, speed, easingMethod);
}

/**
 * Init following things
 * 1. Component
 * 2. Render
 * 3. Config
 */
function _install() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _components = opts._components,
      render = opts.render,
      Vue$$1 = opts.Vue,
      _opts$components = opts.components,
      components = _opts$components === undefined ? {} : _opts$components,
      _opts$config = opts.config,
      config = _opts$config === undefined ? {} : _opts$config,
      _opts$ops = opts.ops,
      ops = _opts$ops === undefined ? {} : _opts$ops,
      validator = opts.validator;

  // Init component

  var comp = _components = _components || {};
  comp.forEach(function (_) {
    components[_.name] = _;
  });

  opts.components = components;
  opts.Vue = Vue$$1;
  opts.render = render;

  // Create component
  withBase(opts);

  // Init Config
  extendOpts(config, validator);
  // Inject global config
  Vue$$1.prototype.$vuescrollConfig = ops;
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

function scrollTo(elm, x, y) {
  var speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 300;
  var easing = arguments[4];
  var animate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var scrollingComplete = arguments[6];

  var scrollLeft = void 0,
      scrollTop = void 0,
      scrollHeight = void 0,
      scrollWidth = void 0,
      clientWidth = void 0,
      clientHeight = void 0;

  var _elm = elm,
      nodeType = _elm.nodeType;


  if (!nodeType) {
    warn('You must pass a dom for the first param, ' + 'for window scrolling, ' + 'you can pass document as the first param.');

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

  if (animate) {
    goScrolling(x, y, scrollLeft, scrollTop, scrollWidth, scrollHeight, speed, easing, scrollingComplete, function (x, y) {
      elm.scrollLeft = x;
      elm.scrollTop = y;
    });
  } else {
    elm.scrollTop = y;
    elm.scrollLeft = x;
  }
}

var api$1 = {
  methods: {
    nativeScrollTo: function nativeScrollTo(x, y, animate) {
      scrollTo(this.scrollPanelElm, x, y, this.mergedOptions.scrollPanel.speed, this.mergedOptions.scrollPanel.easing, animate, this.scrollingComplete.bind(this));
    },
    getCurrentviewDomNative: function getCurrentviewDomNative() {
      var parent = this.scrollContentElm;
      var domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};

// begin importing
var scrollPanel = {
  name: 'scrollPanel',
  props: { ops: { type: Object, required: true } },
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
        parent.scrollTo({ x: x, y: y });
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
  render: function render(h) {
    // eslint-disable-line
    var data = {
      class: ['__panel'],
      style: {}
    };

    var parent = getRealParent(this);

    var _customPanel = parent.$slots['scroll-panel'];
    if (_customPanel) {
      return insertChildrenIntoSlot(h, _customPanel, this.$slots.default, data);
    }

    return h(
      'div',
      data,
      [[this.$slots.default]]
    );
  }
};

function getPanelData(context) {
  // scrollPanel data start
  var data = {
    ref: 'scrollPanel',
    style: {},
    class: [],
    nativeOn: {
      '&scroll': context.handleScroll
    },
    props: {
      ops: context.mergedOptions.scrollPanel
    }
  };
  data.class.push('__native');
  // dynamic set overflow scroll
  // feat: #11
  if (context.mergedOptions.scrollPanel.scrollingY) {
    data.style['overflowY'] = context.bar.vBar.state.size ? 'scroll' : '';
  } else {
    data.style['overflowY'] = 'hidden';
  }

  if (context.mergedOptions.scrollPanel.scrollingX) {
    data.style['overflowX'] = context.bar.hBar.state.size ? 'scroll' : '';
  } else {
    data.style['overflowX'] = 'hidden';
  }

  var gutter = getGutter();
  /* istanbul ignore if */
  if (!gutter) {
    data.class.push('__hidebar');
  } else {
    // hide system bar by use a negative value px
    // gutter should be 0 when manually disable scrollingX #14
    if (context.bar.vBar.state.size && context.mergedOptions.scrollPanel.scrollingY) {
      if (context.mergedOptions.scrollPanel.verticalNativeBarPos == 'right') {
        data.style.marginRight = '-' + gutter + 'px';
      } /* istanbul ignore next */else {
          data.style.marginLeft = '-' + gutter + 'px';
        }
    }
    if (context.bar.hBar.state.size && context.mergedOptions.scrollPanel.scrollingX) {
      data.style.height = 'calc(100% + ' + gutter + 'px)';
    }
  }

  // clear legency styles of slide mode...
  data.style.transformOrigin = '';
  data.style.transform = '';

  return data;
}

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} context
 * @returns
 */
function createPanel(h, context) {
  var data = {};

  data = getPanelData(context);

  return h(
    'scrollPanel',
    data,
    [getPanelChildren(h, context)]
  );
}

function getPanelChildren(h, context) {
  var viewStyle = {};
  var data = {
    style: viewStyle,
    ref: 'scrollContent',
    class: '__view'
  };
  var _customContent = context.$slots['scroll-content'];

  if (context.mergedOptions.scrollPanel.scrollingX) {
    viewStyle.width = getComplitableStyle('width', 'fit-content');
  }

  if (context.mergedOptions.scrollPanel.padding) {
    data.style.paddingRight = context.mergedOptions.rail.size;
  }

  if (_customContent) {
    return insertChildrenIntoSlot(h, _customContent, context.$slots.default, data);
  }

  return h(
    'div',
    data,
    [context.$slots.default]
  );
}

/**
 * These mixes is exclusive for native mode
 */

var updateNative = {
  methods: {
    updateNativeModeBarState: function updateNativeModeBarState() {
      var container = this.scrollPanelElm;
      var isPercent = this.mergedOptions.vuescroll.sizeStrategy == 'percent';
      var clientWidth = isPercent ? container.clientWidth : this.vuescroll.state.width.slice(0, -2); // xxxpx ==> xxx
      var clientHeight = isPercent ? container.clientHeight : this.vuescroll.state.height.slice(0, -2);

      var heightPercentage = clientHeight * 100 / container.scrollHeight;
      var widthPercentage = clientWidth * 100 / container.scrollWidth;

      this.bar.vBar.state.posValue = container.scrollTop * 100 / clientHeight;
      this.bar.hBar.state.posValue = container.scrollLeft * 100 / clientWidth;

      this.bar.vBar.state.size = heightPercentage < 100 ? heightPercentage + '%' : 0;
      this.bar.hBar.state.size = widthPercentage < 100 ? widthPercentage + '%' : 0;
    },
    recordNativeCurrentPos: function recordNativeCurrentPos() {
      var state = this.vuescroll.state;
      var axis = {
        x: this.scrollPanelElm.scrollLeft,
        y: this.scrollPanelElm.scrollTop
      };
      var oldX = state.internalScrollLeft;
      var oldY = state.internalScrollTop;

      state.posX = oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;

      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
    }
  },
  computed: {
    scrollContentElm: function scrollContentElm() {
      return this.$refs['scrollContent']._isVue ? this.$refs['scrollContent'].$el : this.$refs['scrollContent'];
    }
  }
};

var core$1 = {
  mixins: [api$1, updateNative],
  methods: {
    destroy: function destroy() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        this.destroyResize();
      }
    },
    getCurrentviewDom: function getCurrentviewDom() {
      this.getCurrentviewDomNaitve();
    },
    internalScrollTo: function internalScrollTo(destX, destY, animate) {
      this.nativeScrollTo(destX, destY, animate);
    },
    updateBarStateAndEmitEvent: function updateBarStateAndEmitEvent(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.updateNativeModeBarState();
      if (eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
      if (this.mergedOptions.bar.onlyShowBarOnScroll) {
        if (eventType == 'handle-scroll' || eventType == 'handle-resize' || eventType == 'refresh-status' || eventType == 'window-resize' || eventType == 'options-change') {
          this.showAndDefferedHideBar(true /* forceHideBar: true */);
        }
      } else {
        this.showAndDefferedHideBar();
      }
    },
    emitEvent: function emitEvent(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _scrollPanelElm = this.scrollPanelElm,
          scrollHeight = _scrollPanelElm.scrollHeight,
          scrollWidth = _scrollPanelElm.scrollWidth,
          clientHeight = _scrollPanelElm.clientHeight,
          clientWidth = _scrollPanelElm.clientWidth,
          scrollTop = _scrollPanelElm.scrollTop,
          scrollLeft = _scrollPanelElm.scrollLeft;


      var vertical = {
        type: 'vertical'
      };
      var horizontal = {
        type: 'horizontal'
      };

      vertical['process'] = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
      horizontal['process'] = Math.min(scrollLeft / (scrollWidth - clientWidth), 1);

      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;
      // Current scroll direction
      vertical['directionY'] = this.vuescroll.state.posY;
      horizontal['directionX'] = this.vuescroll.state.posX;

      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    recordCurrentPos: function recordCurrentPos() {
      this.recordNativeCurrentPos();
    },
    initVariables: function initVariables() {
      this.$el._isVuescroll = true;
      this.clearScrollingTimes();
    },
    refreshInternalStatus: function refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize();
      // 2. registry resize event
      this.registryResize();
      // 3. update scrollbar's height/width
      this.updateBarStateAndEmitEvent('refresh-status');
    },
    registryResize: function registryResize() {
      var _this = this;

      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }

      var contentElm = this.scrollContentElm;

      var vm = this;
      var handleWindowResize = function handleWindowResize() /* istanbul ignore next */{
        vm.updateBarStateAndEmitEvent('window-resize');
      };
      var handleDomResize = function handleDomResize() {
        var currentSize = {};
        currentSize['width'] = _this.scrollPanelElm.scrollWidth;
        currentSize['height'] = _this.scrollPanelElm.scrollHeight;
        _this.updateBarStateAndEmitEvent('handle-resize', currentSize);
      };
      window.addEventListener('resize', handleWindowResize, false);

      var resizeEnable = this.mergedOptions.vuescroll.detectResize;
      var destroyDomResize = resizeEnable ? installResizeDetection(contentElm, handleDomResize) : function () {};

      var destroyWindowResize = function destroyWindowResize() {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = function () {
        destroyWindowResize();
        destroyDomResize();
      };
    }
  }
};

var mixins = [core$1];

function install(Vue$$1) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  opts._components = [scrollPanel, bar];
  opts.mixins = mixins;
  opts.render = createPanel;
  opts.Vue = Vue$$1;

  _install(opts);
}

var Vuescroll = {
  install: install,
  version: '4.9.0-beta.4',
  refreshAll: refreshAll,
  scrollTo: scrollTo
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuescroll);
}

return Vuescroll;

})));
