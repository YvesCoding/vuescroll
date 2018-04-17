/*
    * @name: vuescroll 4.2.2
    * @author: (c) 2018-2018 wangyi7099
    * @description: A reactive virtual scrollbar based on vue.js 2.X
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   
import Vue from 'vue';

var map = {
  vertical: {
    bar: {
      size: "height",
      opsSize: "width",
      posName: "top",
      page: "pageY",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      offset: "offsetHeight",
      client: "clientY"
    },
    axis: "Y"
  },
  horizontal: {
    bar: {
      size: "width",
      opsSize: "height",
      posName: "left",
      page: "pageX",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      offset: "offsetWidth",
      client: "clientX"
    },
    axis: "X"
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
  target = (typeof target === "undefined" ? "undefined" : _typeof(target)) === "object" && target || {};
  for (var key in source) {
    target[key] = _typeof(source[key]) === "object" ? deepCopy(source[key], target[key] = {}) : source[key];
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
    if (_typeof(from[key]) === "object") {
      if (typeof to[key] === "undefined") {
        to[key] = {};
        deepCopy(from[key], to[key]);
      } else {
        deepMerge(from[key], to[key]);
      }
    } else {
      if (typeof to[key] === "undefined") to[key] = from[key];
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
  if (!source[key] && typeof source !== "function") {
    return;
  }
  souceKey = souceKey || key;
  if (typeof source === "function") {
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

  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  var inner = document.createElement("div");
  inner.style.width = "100%";
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
var haveCreatedRefreshDomClass = false;
var haveCreatedLoadDomClass = false;

function hideSystemBar() {
  if (haveHideen) {
    return;
  }
  haveHideen = true;
  var styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML = ".vuescroll-panel::-webkit-scrollbar{width:0;height:0}";
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
}

function createRefreshDomStyle() {
  if (haveCreatedRefreshDomClass) {
    return;
  }
  haveCreatedRefreshDomClass = true;
  var styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML = "\n    .vuescroll-refresh {\n        color: black;\n        height: 50px;\n        text-align: center;\n        font-size: 16px;\n        line-height: 50px;\n    }\n    .vuescroll-refresh svg {\n        margin-right: 10px;\n        width: 25px;\n        height: 25px;\n        vertical-align: sub;\n    }\n    .vuescroll-refresh svg path,\n    .vuescroll-refresh svg rect{\n    fill: #FF6700;\n    }\n    ";
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
}

function createLoadDomStyle() {
  if (haveCreatedLoadDomClass) {
    return;
  }
  haveCreatedLoadDomClass = true;
  var styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML = "\n        .vuescroll-load {\n            color: black;\n            height: 50px;\n            text-align: center;\n            font-size: 16px;\n            line-height: 50px;\n        }\n        .vuescroll-load svg {\n            margin-right: 10px;\n            width: 25px;\n            height: 25px;\n            vertical-align: sub;\n        }\n        .vuescroll-load svg path,\n        .vuescroll-load svg rect{\n        fill: #FF6700;\n        }\n        ";
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
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
    transform: "translate" + map[type].axis + "(" + posValue + "%)",
    msTransform: "translate" + map[type].axis + "(" + posValue + "%)",
    webkitTransform: "translate" + map[type].axis + "(" + posValue + "%)"
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
    if (easing === "easeInQuad") pattern = time * time; // accelerating from zero velocity
    if (easing === "easeOutQuad") pattern = time * (2 - time); // decelerating to zero velocity
    if (easing === "easeInOutQuad") pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if (easing === "easeInCubic") pattern = time * time * time; // accelerating from zero velocity
    if (easing === "easeOutCubic") pattern = --time * time * time + 1; // decelerating to zero velocity
    if (easing === "easeInOutCubic") pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if (easing === "easeInQuart") pattern = time * time * time * time; // accelerating from zero velocity
    if (easing === "easeOutQuart") pattern = 1 - --time * time * time * time; // decelerating to zero velocity
    if (easing === "easeInOutQuart") pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
    if (easing === "easeInQuint") pattern = time * time * time * time * time; // accelerating from zero velocity
    if (easing === "easeOutQuint") pattern = 1 + --time * time * time * time * time; // decelerating to zero velocity
    if (easing === "easeInOutQuint") pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
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
  var startLocationY = elm["scrollTop"];
  var startLocationX = elm["scrollLeft"];
  /**
     * keep the limit of scroll delta.
     */
  /* istanbul ignore next */
  {
    if (startLocationY + deltaY < 0) {
      deltaY = -startLocationY;
    }
    if (startLocationY + deltaY > elm["scrollHeight"]) {
      deltaY = elm["scrollHeight"] - startLocationY;
    }
    if (startLocationX + deltaX < 0) {
      deltaX = -startLocationX;
    }
    if (startLocationX + deltaX > elm["scrollWidth"]) {
      deltaX = elm["scrollWidth"] - startLocationX;
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
      elm["scrollTop"] = Math.floor(positionY);
      elm["scrollLeft"] = Math.floor(positionX);
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
  var object = document.createElement("object");
  object.style.cssText = OBJECT_STYLE;
  object.tabIndex = -1;
  object.type = "text/html";
  object.onload = function () {
    funArr.forEach(function (func) {
      on(object.contentDocument.defaultView, "resize", func);
    });
  };
  element.appendChild(object);
  return function destroy() {
    if (object.contentDocument) {
      funArr.forEach(function (func) {
        off(object.contentDocument.defaultView, "resize", func);
      });
    }
    element.removeChild(object);
  };
}

var modes = ["slide", "native"];
var GCF = {
  // vuescroll
  vuescroll: {
    mode: "native",
    // pullRefresh or pushLoad is only for the slide mode...
    pullRefresh: {
      enable: false,
      tips: {
        deactive: "Pull to Refresh",
        active: "Release to Refresh",
        start: "Refreshing...",
        beforeDeactive: "Refresh Successfully!"
      }
    },
    pushLoad: {
      enable: false,
      tips: {
        deactive: "Push to Load",
        active: "Release to Load",
        start: "Loading...",
        beforeDeactive: "Load Successfully!"
      }
    }
  },
  scrollPanel: {
    // when component mounted.. it will automatically scrolls.
    initialScrollY: false,
    initialScrollX: false,
    // feat: #11
    scrollingX: true,
    scrollingY: true,
    speed: 300,
    easing: undefined
  },
  // 
  scrollContent: {
    // customize tag of scrollContent
    tag: "div",
    padding: true,
    props: {},
    attrs: {}
  },
  // 
  vRail: {
    width: "5px",
    pos: "right",
    background: "#a5d6a7",
    opacity: 0 //'0.5'
  },
  // 
  hRail: {
    height: "5px",
    pos: "bottom",
    background: "#a5d6a7",
    opacity: 0 //'0.5'
  },
  // 
  vBar: {
    width: "5px",
    pos: "right",
    background: "#4caf50",
    deltaY: 100,
    keepShow: false,
    opacity: 1,
    hover: false
  },
  // 
  hBar: {
    height: "5px",
    pos: "bottom",
    background: "#4caf50",
    keepShow: false,
    opacity: 1,
    hover: false
  }
};
/**
 * validate the options
 * 
 * @export
 * @param {any} ops 
 */
function validateOptions(ops) {
  var shouldStopRender = false;
  var vuescroll = ops.vuescroll,
      scrollPanel = ops.scrollPanel;

  // validate vuescroll

  if (!~modes.indexOf(vuescroll.mode)) {
    console.error("[vuescroll]: The vuescroll's option \"mode\" should be one of the " + modes); //eslint-disable-line 
    shouldStopRender = true;
  }

  // validate scrollPanel
  var initialScrollY = scrollPanel["initialScrollY"];
  var initialScrollX = scrollPanel["initialScrollX"];

  if (initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
    console.error("[vuescroll]: The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100."); // eslint-disable-line 
  }

  if (initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
    console.error("[vuescroll]: The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100."); // eslint-disable-line 
  }

  return shouldStopRender;
}

/**
 * hack the lifeCycle 
 * 
 * to merge the global data into user-define data
 */
function hackPropsData() {
  var vm = this;
  if (vm.$options.name === "vueScroll") {
    var _gfc = deepMerge(vm.$vuescrollConfig, {});
    var ops = deepMerge(GCF, _gfc);
    vm.$options.propsData.ops = vm.$options.propsData.ops || {};
    Object.keys(vm.$options.propsData.ops).forEach(function (key) {
      {
        defineReactive(vm.mergedOptions, key, vm.$options.propsData.ops);
      }
    });
    // from ops to mergedOptions
    deepMerge(ops, vm.mergedOptions);
    // to sync the rail and bar
    defineReactive(vm.mergedOptions.vBar, "pos", vm.mergedOptions.vRail);
    defineReactive(vm.mergedOptions.vBar, "width", vm.mergedOptions.vRail);
    defineReactive(vm.mergedOptions.hBar, "pos", vm.mergedOptions.hRail);
    defineReactive(vm.mergedOptions.hBar, "height", vm.mergedOptions.hRail);

    var prefix = "padding-";
    defineReactive(vm.mergedOptions.scrollContent, "paddPos", function () {
      return prefix + vm.mergedOptions.vRail.pos;
    });
    defineReactive(vm.mergedOptions.scrollContent, "paddValue", function () {
      return vm.mergedOptions.vRail.width;
    });
  }
}
var LifeCycleMix = {
  data: function data() {
    return {
      shouldStopRender: false
    };
  },
  created: function created() {
    hackPropsData.call(this);
    this.shouldStopRender = validateOptions(this.mergedOptions);
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
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (typeof pos.x === "undefined") {
        pos.x = this.$refs["scrollPanel"].$el.scrollLeft;
      } else {
        pos.x = extractScrollDistance(pos.x, "scrollWidth", this.scrollPanelElm);
      }
      if (typeof pos.y === "undefined") {
        pos.y = this.$refs["scrollPanel"].$el.scrollTop;
      } else {
        pos.y = extractScrollDistance(pos.y, "scrollHeight", this.scrollPanelElm);
      }
      var x = pos.x;
      var y = pos.y;
      if (this.mode == "native") {
        if (animate) {
          goScrolling(this.$refs["scrollPanel"].$el, x - this.$refs["scrollPanel"].$el.scrollLeft, y - this.$refs["scrollPanel"].$el.scrollTop, this.mergedOptions.scrollPanel.speed, this.mergedOptions.scrollPanel.easing);
        } else {
          this.$refs["scrollPanel"].$el.scrollTo(x, y);
        }
      }
      // for non-native we use scroller's scorllTo 
      else if (this.mode == "slide") {
          this.scroller.scrollTo(pos.x, pos.y, animate);
        }
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

var nativeMode = {
  methods: {
    updateNativeModeBarState: function updateNativeModeBarState() {
      var scrollPanel = this.scrollPanelElm;
      var heightPercentage = scrollPanel.clientHeight * 100 / scrollPanel.scrollHeight;
      var widthPercentage = scrollPanel.clientWidth * 100 / scrollPanel.scrollWidth;
      this.vBar.state.posValue = scrollPanel.scrollTop * 100 / scrollPanel.clientHeight;
      this.hBar.state.posValue = scrollPanel.scrollLeft * 100 / scrollPanel.clientWidth;
      this.vBar.state.size = heightPercentage < 100 ? heightPercentage + "%" : 0;
      this.hBar.state.size = widthPercentage < 100 ? widthPercentage + "%" : 0;
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
var global = window;

core.effect.Animate = {

  /**
     * A requestAnimationFrame wrapper / polyfill.
     *
     * @param callback {Function} The callback to be invoked before the next repaint.
     * @param root {HTMLElement} The root element for the repaint
     */
  requestAnimationFrame: function () {

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
      requestCount++;

      // Create timeout at first request
      if (intervalHandle === null) {

        intervalHandle = setInterval(function () {

          var time = +new Date();
          var currentRequests = requests;

          // Reset data structure before executing callbacks
          requests = {};
          requestCount = 0;

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
  }(),

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
var NOOP = function NOOP() {};

function createEasingFunction(easing) {
  return function (pos) {
    return easingPattern(easing, pos);
  };
}

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
    bouncing: true,

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

    /**
    * easing mode..
    * @description 
    * @author wangyi
    */
    animatingEasing: "easeOutCubic",

    noAnimatingEasing: "easeInOutCubic",

    /** This configures the amount of change applied to deceleration when reaching boundaries  **/
    penetrationDeceleration: 0.03,

    /** This configures the amount of change applied to acceleration when reaching boundaries  **/
    penetrationAcceleration: 0.08

  };

  for (var key in options) {
    this.options[key] = options[key];
  }

  animatingMethod = createEasingFunction(this.options.animatingEasing);
  noAnimatingMethod = createEasingFunction(this.options.noAnimatingEasing);
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
  setDimensions: function setDimensions(clientWidth, clientHeight, contentWidth, contentHeight) {

    var self = this;

    // Only update values which are defined
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
    }

    // Refresh maximums
    self.__computeScrollMax();

    // Refresh scroll position
    self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
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
  activatePullToRefresh: function activatePullToRefresh(height, activateCallback, deactivateCallback, startCallback, beforeDeactivateCallback) {

    var self = this;

    self.__refreshHeight = height;
    self.__refreshActivate = activateCallback;
    self.__refreshBeforeDeactivate = beforeDeactivateCallback;
    self.__refreshDeactivate = deactivateCallback;
    self.__refreshStart = startCallback;
  },
  activatePushToLoad: function activatePushToLoad(height, activateCallback, deactivateCallback, startCallback, beforeDeactivateCallback) {

    var self = this;

    self.__loadHeight = height;
    self.__loadActivate = activateCallback;
    self.__loadBeforeDeactivate = beforeDeactivateCallback;
    self.__loadDeactivate = deactivateCallback;
    self.__loadStart = startCallback;
  },

  /**
  * Starts pull-to-refresh manually.
  */
  triggerRefreshOrLoad: function triggerRefreshOrLoad() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "refresh";

    // Use publish instead of scrollTo to allow scrolling to out of boundary position
    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
    if (type == "refresh") {
      this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);
      if (this.__refreshStart) {
        this.__refreshStart();
      }
    } else {
      this.__publish(this.__scrollLeft, this.__maxScrollTop + this.__loadHeight, this.__zoomLevel, true);
      if (this.__loadStart) {
        this.__loadStart();
      }
    }
  },

  /**
  * Signalizes that pull-to-refresh is finished.
  */
  finishRefreshOrLoad: function finishRefreshOrLoad() {

    var self = this;

    if (self.__refreshBeforeDeactivate && self.__refreshActive) {

      self.__refreshActive = false;
      self.__refreshBeforeDeactivate(function () {
        if (self.__refreshDeactivate) {
          self.__refreshDeactivate();
        }
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
      });
    } else if (self.__refreshDeactivate && self.__refreshActive) {
      self.__refreshActive = false;
      self.__refreshDeactivate();
      self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
    }

    if (self.__loadBeforeDeactivate && self.__loadActive) {

      self.__loadActive = false;
      self.__loadBeforeDeactivate(function () {
        if (self.__loadDeactivate) {
          self.__loadDeactivate();
        }
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
      });
    } else if (self.__loadDeactivate && self.__loadActive) {
      self.__loadActive = false;
      self.__loadDeactivate();
      self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
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
      throw new Error("Zooming is not enabled!");
    }

    // Add callback if exists
    if (callback) {
      self.__zoomComplete = callback;
    }

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    }

    var oldLevel = self.__zoomLevel;

    // Normalize input origin to center of viewport if not defined
    if (originLeft == null) {
      originLeft = self.__clientWidth / 2;
    }

    if (originTop == null) {
      originTop = self.__clientHeight / 2;
    }

    // Limit level according to configuration
    level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

    // Recompute maximum values while temporary tweaking maximum scroll ranges
    self.__computeScrollMax(level);

    // Recompute left and top coordinates based on new zoom level
    var left = (originLeft + self.__scrollLeft) * level / oldLevel - originLeft;
    var top = (originTop + self.__scrollTop) * level / oldLevel - originTop;

    // Limit x-axis
    if (left > self.__maxScrollLeft) {
      left = self.__maxScrollLeft;
    } else if (left < 0) {
      left = 0;
    }

    // Limit y-axis
    if (top > self.__maxScrollTop) {
      top = self.__maxScrollTop;
    } else if (top < 0) {
      top = 0;
    }

    // Push values out
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
  scrollTo: function scrollTo(left, top, animate, zoom) {

    var self = this;

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
    }

    // Correct coordinates based on new zoom level
    if (zoom != null && zoom !== self.__zoomLevel) {

      if (!self.options.zooming) {
        throw new Error("Zooming is not enabled!");
      }

      left *= zoom;
      top *= zoom;

      // Recompute maximum values while temporary tweaking maximum scroll ranges
      self.__computeScrollMax(zoom);
    } else {

      // Keep zoom when not defined
      zoom = self.__zoomLevel;
    }

    if (!self.options.scrollingX) {

      left = self.__scrollLeft;
    } else {

      if (self.options.paging) {
        left = Math.round(left / self.__clientWidth) * self.__clientWidth;
      } else if (self.options.snapping) {
        left = Math.round(left / self.__snapWidth) * self.__snapWidth;
      }
    }

    if (!self.options.scrollingY) {

      top = self.__scrollTop;
    } else {

      if (self.options.paging) {
        top = Math.round(top / self.__clientHeight) * self.__clientHeight;
      } else if (self.options.snapping) {
        top = Math.round(top / self.__snapHeight) * self.__snapHeight;
      }
    }

    // Limit for allowed ranges
    left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
    top = Math.max(Math.min(self.__maxScrollTop, top), 0);
    // Don't animate when no change detected, still call publish to make sure
    // that rendered position is really in-sync with internal data
    if (left === self.__scrollLeft && top === self.__scrollTop) {
      animate = false;
    }

    // Publish new values
    if (!self.__isTracking) {
      self.__publish(left, top, zoom, animate);
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
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Reset interruptedAnimation flag
    self.__interruptedAnimation = true;

    // Stop deceleration
    if (self.__isDecelerating) {
      core.effect.Animate.stop(self.__isDecelerating);
      self.__isDecelerating = false;
      self.__interruptedAnimation = true;
    }

    // Stop animation
    if (self.__isAnimating) {
      core.effect.Animate.stop(self.__isAnimating);
      self.__isAnimating = false;
      self.__interruptedAnimation = true;
    }

    // Use center point when dealing with two fingers
    var currentTouchLeft, currentTouchTop;
    var isSingleTouch = touches.length === 1;
    if (isSingleTouch) {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    } else {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    }

    // Store initial positions
    self.__initialTouchLeft = currentTouchLeft;
    self.__initialTouchTop = currentTouchTop;

    // Store current zoom level
    self.__zoomLevelStart = self.__zoomLevel;

    // Store initial touch positions
    self.__lastTouchLeft = currentTouchLeft;
    self.__lastTouchTop = currentTouchTop;

    // Store initial move time stamp
    self.__lastTouchMove = timeStamp;

    // Reset initial scale
    self.__lastScale = 1;

    // Reset locking flags
    self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
    self.__enableScrollY = !isSingleTouch && self.options.scrollingY;

    // Reset tracking flag
    self.__isTracking = true;

    // Reset deceleration complete flag
    self.__didDecelerationComplete = false;

    // Dragging starts directly with two fingers, otherwise lazy with an offset
    self.__isDragging = !isSingleTouch;

    // Some features are disabled in multi touch scenarios
    self.__isSingleTouch = isSingleTouch;

    // Clearing data structure
    self.__positions = [];
  },

  /**
  * Touch move handler for scrolling support
  */
  doTouchMove: function doTouchMove(touches, timeStamp, scale) {

    // Array-like check is enough here
    if (touches.length == null) {
      throw new Error("Invalid touch list: " + touches);
    }

    if (timeStamp instanceof Date) {
      timeStamp = timeStamp.valueOf();
    }
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Ignore event when tracking is not enabled (event might be outside of element)
    if (!self.__isTracking) {
      return;
    }

    var currentTouchLeft, currentTouchTop;

    // Compute move based around of center of fingers
    if (touches.length === 2) {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
      currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
    } else {
      currentTouchLeft = touches[0].pageX;
      currentTouchTop = touches[0].pageY;
    }

    var positions = self.__positions;

    // Are we already is dragging mode?
    if (self.__isDragging) {

      // Compute move distance
      var moveX = currentTouchLeft - self.__lastTouchLeft;
      var moveY = currentTouchTop - self.__lastTouchTop;

      // Read previous scroll position and zooming
      var scrollLeft = self.__scrollLeft;
      var scrollTop = self.__scrollTop;
      var level = self.__zoomLevel;

      // Work with scaling
      if (scale != null && self.options.zooming) {

        var oldLevel = level;

        // Recompute level based on previous scale and new scale
        level = level / self.__lastScale * scale;

        // Limit level according to configuration
        level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

        // Only do further compution when change happened
        if (oldLevel !== level) {

          // Compute relative event position to container
          var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
          var currentTouchTopRel = currentTouchTop - self.__clientTop;

          // Recompute left and top coordinates based on new zoom level
          scrollLeft = (currentTouchLeftRel + scrollLeft) * level / oldLevel - currentTouchLeftRel;
          scrollTop = (currentTouchTopRel + scrollTop) * level / oldLevel - currentTouchTopRel;

          // Recompute max scroll values
          self.__computeScrollMax(level);
        }
      }

      if (self.__enableScrollX) {

        scrollLeft -= moveX * this.options.speedMultiplier;
        var maxScrollLeft = self.__maxScrollLeft;

        if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

          // Slow down on the edges
          if (self.options.bouncing) {

            scrollLeft += moveX / 2 * this.options.speedMultiplier;
          } else if (scrollLeft > maxScrollLeft) {

            scrollLeft = maxScrollLeft;
          } else {

            scrollLeft = 0;
          }
        }
      }

      // Compute new vertical scroll position
      if (self.__enableScrollY) {

        scrollTop -= moveY * this.options.speedMultiplier;
        var maxScrollTop = self.__maxScrollTop;

        if (scrollTop > maxScrollTop || scrollTop < 0) {

          // Slow down on the edges
          if (self.options.bouncing) {

            scrollTop += moveY / 2 * this.options.speedMultiplier;

            // Support pull-to-refresh (only when only y is scrollable)
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
              }
              // handle for push-load
              else if (!self.__loadActive && scrollTop >= self.__maxScrollTop + self.__loadHeight) {

                  self.__loadActive = true;
                  if (self.__loadActivate) {
                    self.__loadActivate();
                  }
                } else if (self.__refreshActive && scrollTop < self.__maxScrollTop + self.__loadHeight) {

                  self.__loadActive = false;
                  if (self.__loadDeactivate) {
                    self.__loadDeactivate();
                  }
                }
            }
          } else if (scrollTop > maxScrollTop) {

            scrollTop = maxScrollTop;
          } else {

            scrollTop = 0;
          }
        }
      }

      // Keep list from growing infinitely (holding min 10, max 20 measure points)
      if (positions.length > 60) {
        positions.splice(0, 30);
      }

      // Track scroll movement for decleration
      positions.push(scrollLeft, scrollTop, timeStamp);

      // Sync scroll position
      self.__publish(scrollLeft, scrollTop, level);

      // Otherwise figure out whether we are switching into dragging mode now.
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
    }

    // Update last touch positions and time stamp for next event
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
    if (typeof timeStamp !== "number") {
      throw new Error("Invalid timestamp value: " + timeStamp);
    }

    var self = this;

    // Ignore event when tracking is not enabled (no touchstart event on element)
    // This is required as this listener ('touchmove') sits on the document and not on the element itself.
    if (!self.__isTracking) {
      return;
    }

    // Not touching anymore (when two finger hit the screen there are two touch end events)
    self.__isTracking = false;

    // Be sure to reset the dragging flag now. Here we also detect whether
    // the finger has moved fast enough to switch into a deceleration animation.
    if (self.__isDragging) {

      // Reset dragging flag
      self.__isDragging = false;

      // Start deceleration
      // Verify that the last move detected was in some relevant time frame
      if (self.__isSingleTouch && self.options.animating && timeStamp - self.__lastTouchMove <= 100) {

        // Then figure out what the scroll position was about 100ms ago
        var positions = self.__positions;
        var endPos = positions.length - 1;
        var startPos = endPos;

        // Move pointer to position measured 100ms ago
        for (var i = endPos; i > 0 && positions[i] > self.__lastTouchMove - 100; i -= 3) {
          startPos = i;
        }

        // If start and stop position is identical in a 100ms timeframe,
        // we cannot compute any useful deceleration.
        if (startPos !== endPos) {

          // Compute relative movement between these two points
          var timeOffset = positions[endPos] - positions[startPos];
          var movedLeft = self.__scrollLeft - positions[startPos - 2];
          var movedTop = self.__scrollTop - positions[startPos - 1];

          // Based on 50ms compute the movement to apply for each render step
          self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
          self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

          // How much velocity is required to start the deceleration
          var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;

          // Verify that we have enough velocity to start deceleration
          if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {

            // Deactivate pull-to-refresh when decelerating
            if (!self.__refreshActive && !self.__loadActive) {
              self.__startDeceleration(timeStamp);
            }
          } else {
            self.options.scrollingComplete();
          }
        } else {
          self.options.scrollingComplete();
        }
      } else if (timeStamp - self.__lastTouchMove > 100) {
        self.options.scrollingComplete();
      }
    }

    // If this was a slower move it is per default non decelerated, but this
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
          self.options.scrollingComplete();
        }
        self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);

        // Directly signalize deactivation (nothing todo on refresh?)
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
    }

    // Fully cleanup list
    self.__positions.length = 0;
  },

  /** Handle for scroll/publish */
  onScroll: NOOP,

  stop: function stop() {
    var self = this;

    self.__disable = true;
  },
  start: function start() {
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
  __publish: function __publish(left, top, zoom, animate) {

    var self = this;
    if (self.__disable) {
      return;
    }
    // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
    var wasAnimating = self.__isAnimating;
    if (wasAnimating) {
      core.effect.Animate.stop(wasAnimating);
      self.__isAnimating = false;
    }

    if (animate && self.options.animating) {

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
          self.__zoomLevel = oldZoom + diffZoom * percent;

          // Push values out
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
          self.options.scrollingComplete();
        }

        if (self.options.zooming) {
          self.__computeScrollMax();
          if (self.__zoomComplete) {
            self.__zoomComplete();
            self.__zoomComplete = null;
          }
        }
      };

      // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
      self.__isAnimating = core.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? animatingMethod : noAnimatingMethod);
    } else {

      self.__scheduledLeft = self.__scrollLeft = left;
      self.__scheduledTop = self.__scrollTop = top;
      self.__scheduledZoom = self.__zoomLevel = zoom;

      // Push values out
      if (self.__callback) {
        self.__callback(left, top, zoom);
        self.onScroll();
      }

      // Fix max scroll ranges
      if (self.options.zooming) {
        self.__computeScrollMax();
        if (self.__zoomComplete) {
          self.__zoomComplete();
          self.__zoomComplete = null;
        }
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
      var clientHeight = self.__clientHeight;

      // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
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
    }

    // Wrap class method
    var step = function step(percent, now, render) {
      self.__stepThroughDeceleration(render);
    };

    // How much velocity is required to keep the deceleration running
    var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.001;

    // Detect whether it's still worth to continue animating steps
    // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
    var verify = function verify() {
      var shouldContinue = Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
      if (!shouldContinue) {
        self.__didDecelerationComplete = true;
      }
      return shouldContinue;
    };

    var completed = function completed() {
      self.__isDecelerating = false;
      if (self.__didDecelerationComplete) {
        self.options.scrollingComplete();
      }

      // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
      self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
    };

    // Start animation and switch on flag
    self.__isDecelerating = core.effect.Animate.start(step, verify, completed);
  },

  /**
  * Called on every step of the animation
  *
  * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
  */
  __stepThroughDeceleration: function __stepThroughDeceleration(render) {

    var self = this;

    //
    // COMPUTE NEXT SCROLL POSITION
    //

    // Add deceleration to scroll position
    var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
    var scrollTop = self.__scrollTop + self.__decelerationVelocityY;

    //
    // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
    //

    if (!self.options.bouncing) {

      var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
      if (scrollLeftFixed !== scrollLeft) {
        scrollLeft = scrollLeftFixed;
        self.__decelerationVelocityX = 0;
      }

      var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
      if (scrollTopFixed !== scrollTop) {
        scrollTop = scrollTopFixed;
        self.__decelerationVelocityY = 0;
      }
    }

    //
    // UPDATE SCROLL POSITION
    //

    if (render) {

      self.__publish(scrollLeft, scrollTop, self.__zoomLevel);
    } else {

      self.__scrollLeft = scrollLeft;
      self.__scrollTop = scrollTop;
    }

    //
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
    }

    //
    // BOUNCING SUPPORT
    //

    if (self.options.bouncing) {

      var scrollOutsideX = 0;
      var scrollOutsideY = 0;

      // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
      var penetrationDeceleration = self.options.penetrationDeceleration;
      var penetrationAcceleration = self.options.penetrationAcceleration;

      // Check limits
      if (scrollLeft < self.__minDecelerationScrollLeft) {
        scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
      } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
        scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
      }

      if (scrollTop < self.__minDecelerationScrollTop) {
        scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
      } else if (scrollTop > self.__maxDecelerationScrollTop) {
        scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
      }

      // Slow down until slow enough, then flip back to snap position
      if (scrollOutsideX !== 0) {
        if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
          self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
        } else {
          self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
        }
      }

      if (scrollOutsideY !== 0) {
        if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
          self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
        } else {
          self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
        }
      }
    }
  }
};

// Copy over members to prototype
for (var key in members) {
  Scroller.prototype[key] = members[key];
}

/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
function render(content, global) {

  var docStyle = document.documentElement.style;

  var engine;
  if (global.opera && Object.prototype.toString.call(opera) === "[object Opera]") {
    engine = "presto";
  } else if ("MozAppearance" in docStyle) {
    engine = "gecko";
  } else if ("WebkitAppearance" in docStyle) {
    engine = "webkit";
  } else if (typeof navigator.cpuClass === "string") {
    engine = "trident";
  }

  var vendorPrefix = {
    trident: "ms",
    gecko: "Moz",
    webkit: "Webkit",
    presto: "O"
  }[engine];

  var helperElem = document.createElement("div");
  var undef;

  var perspectiveProperty = vendorPrefix + "Perspective";
  var transformProperty = vendorPrefix + "Transform";

  if (helperElem.style[perspectiveProperty] !== undef) {

    return function (left, top, zoom) {
      content.style[transformProperty] = "translate3d(" + -left + "px," + -top + "px,0) scale(" + zoom + ")";
    };
  } else if (helperElem.style[transformProperty] !== undef) {

    return function (left, top, zoom) {
      content.style[transformProperty] = "translate(" + -left + "px," + -top + "px) scale(" + zoom + ")";
    };
  } else {

    return function (left, top, zoom) {
      content.style.marginLeft = left ? -left / zoom + "px" : "";
      content.style.marginTop = top ? -top / zoom + "px" : "";
      content.style.zoom = zoom || "";
    };
  }
}

function listenContainer(container, scroller, eventCallback, zooming) {
  var destroy = null;
  // for touch
  function touchstart(e) {
    // Don't react if initial down happens on a form element
    if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
      return;
    }
    eventCallback("mousedown");
    scroller.doTouchStart(e.touches, e.timeStamp);
    e.preventDefault();
  }
  function touchmove(e) {
    eventCallback("mousemove");
    scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
  }
  function touchend(e) {
    eventCallback("mouseup");
    scroller.doTouchEnd(e.timeStamp);
  }
  function touchcancel(e) {
    scroller.doTouchEnd(e.timeStamp);
  }

  // for mouse
  function mousedownEvent(e) {
    if (e.target.tagName.match(/input|textarea|select/i)) {
      return;
    }
    eventCallback("mousedown");
    scroller.doTouchStart([{
      pageX: e.pageX,
      pageY: e.pageY
    }], e.timeStamp);

    mousedown = true;
  }
  function mousemove(e) {
    if (!mousedown) {
      return;
    }
    eventCallback("mousemove");
    scroller.doTouchMove([{
      pageX: e.pageX,
      pageY: e.pageY
    }], e.timeStamp);

    mousedown = true;
  }
  function mouseup(e) {
    if (!mousedown) {
      return;
    }
    eventCallback("mouseup");
    scroller.doTouchEnd(e.timeStamp);

    mousedown = false;
  }
  function zoomHandle(e) {
    scroller.doMouseZoom(e.detail ? e.detail * -120 : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
  }
  if ("ontouchstart" in window) {

    container.addEventListener("touchstart", touchstart, false);

    document.addEventListener("touchmove", touchmove, false);

    document.addEventListener("touchend", touchend, false);

    document.addEventListener("touchcancel", touchcancel, false);

    destroy = function destroy() {
      container.removeEventListener("touchstart", touchstart, false);

      document.removeEventListener("touchmove", touchmove, false);

      document.removeEventListener("touchend", touchend, false);

      document.removeEventListener("touchcancel", touchcancel, false);
    };
  } else {

    var mousedown = false;

    container.addEventListener("mousedown", mousedownEvent, false);

    document.addEventListener("mousemove", mousemove, false);

    document.addEventListener("mouseup", mouseup, false);
    if (zooming) {
      container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", zoomHandle, false);
    }
    // container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
    //     scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
    // }, false);
    destroy = function destroy() {
      container.removeEventListener("mousedown", mousedownEvent, false);
      document.removeEventListener("mousemove", mousemove, false);
      document.removeEventListener("mouseup", mouseup, false);
      container.removeEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", zoomHandle, false);
    };
  }
  // handle __publish event
  scroller.onScroll = function () {
    eventCallback("onscroll");
  };
  return destroy;
}

// import scroller
/**
 * @description refresh callback
 */
var refreshActivateCallback = function refreshActivateCallback() {
  this.vuescroll.state.refreshStage = "active";
};

var refreshStartCallback = function refreshStartCallback() {
  var vm = this;
  vm.vuescroll.state.refreshStage = "start";
  setTimeout(function () {
    vm.scroller.finishRefreshOrLoad();
  }, 2000);
};

var refreshBeforeDeactivateCallback = function refreshBeforeDeactivateCallback(done) {
  var vm = this;
  vm.vuescroll.state.refreshStage = "beforeDeactive";
  setTimeout(function () {
    done();
  }, 500);
};

var refreshDeactivateCallback = function refreshDeactivateCallback() {
  this.vuescroll.state.refreshStage = "deactive";
};

/**
 * @description load callback
 */
var loadActivateCallback = function loadActivateCallback() {
  this.vuescroll.state.loadStage = "active";
};

var loadStartCallback = function loadStartCallback() {
  var vm = this;
  vm.vuescroll.state.loadStage = "start";
  setTimeout(function () {
    vm.scroller.finishRefreshOrLoad();
  }, 2000);
};

var loadBeforeDeactivateCallback = function loadBeforeDeactivateCallback(done) {
  var vm = this;
  vm.vuescroll.state.loadStage = "beforeDeactive";
  setTimeout(function () {
    done();
  }, 500);
};

var loadDeactivateCallback = function loadDeactivateCallback() {
  this.vuescroll.state.loadStage = "deactive";
};

var slideMode = {
  methods: {
    updateScroller: function updateScroller() {
      var clientWidth = this.$el.clientWidth;
      var clientHeight = this.$el.clientHeight;
      var contentWidth = this.scrollPanelElm.scrollWidth;
      var contentHeight = this.scrollPanelElm.scrollHeight;
      var refreshHeight = 0;
      var loadHeight = 0;
      // If the refresh option is true,let's  give a "margin-top" style to 
      // the refresh-tip dom. let it to be invisible when doesn't trigger
      // refresh.
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        var refreshDom = this.$refs["refreshDom"].elm || this.$refs["refreshDom"];
        refreshHeight = refreshDom.scrollHeight;
        refreshDom.style.marginTop = -refreshHeight + "px";
        // the content height should subtracting the refresh dom height
        contentHeight -= refreshHeight;
      }
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        var loadDom = this.$refs["loadDom"].elm || this.$refs["loadDom"];
        loadHeight = loadDom.scrollHeight;
        //  hide the trailing load dom..
        contentHeight -= loadHeight;
      }
      this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
    },
    registryScroller: function registryScroller() {
      var _this = this;

      // disale zooming when refresh or load enabled
      var zooming = !this.refreshLoad;
      var _mergedOptions$scroll = this.mergedOptions.scrollPanel,
          scrollingY = _mergedOptions$scroll.scrollingY,
          scrollingX = _mergedOptions$scroll.scrollingX;
      // Initialize Scroller

      this.scroller = new Scroller(render(this.scrollPanelElm, window), {
        zooming: zooming,
        scrollingY: scrollingY,
        scrollingX: scrollingX && !this.refreshLoad,
        animationDuration: this.mergedOptions.scrollPanel.speed
      });
      var rect = this.$el.getBoundingClientRect();
      this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop);
      var cb = listenContainer(this.$el, this.scroller, function (eventType) {
        // Thie is to dispatch the event from the scroller.
        // to let vuescroll refresh the dom
        switch (eventType) {
          case "mousedown":
            _this.vuescroll.state.isDragging = true;
            break;
          case "onscroll":
            _this.handleScroll(false);
            break;
          case "mouseup":
            _this.vuescroll.state.isDragging = false;
            break;
        }
      }, zooming);
      // registry refresh
      if (this.mergedOptions.vuescroll.pullRefresh.enable) {
        var refreshDom = this.$refs["refreshDom"].elm || this.$refs["refreshDom"];
        if (this.$listeners["refresh-activate"]) {
          refreshActivateCallback = function refreshActivateCallback() {
            _this.vuescroll.state.refreshStage = "active";
            _this.$emit("refresh-activate", _this, refreshDom);
          };
        }
        if (this.$listeners["refresh-before-deactivate"]) {
          refreshBeforeDeactivateCallback = function refreshBeforeDeactivateCallback(done) {
            _this.vuescroll.state.refreshStage = "beforeDeactive";
            _this.$emit("refresh-before-deactivate", _this, refreshDom, done.bind(_this.scroller));
          };
        }
        if (this.$listeners["refresh-deactivate"]) {
          refreshDeactivateCallback = function refreshDeactivateCallback() {
            _this.vuescroll.state.refreshStage = "deactive";
            _this.$emit("refresh-deactivate", _this, refreshDom);
          };
        }
        if (this.$listeners["refresh-start"]) {
          refreshStartCallback = function refreshStartCallback() {
            _this.vuescroll.state.refreshStage = "start";
            _this.$emit("refresh-start", _this, refreshDom, _this.scroller.finishRefreshOrLoad.bind(_this.scroller));
          };
        }
        var refreshHeight = refreshDom.scrollHeight;
        this.scroller.activatePullToRefresh(refreshHeight, refreshActivateCallback.bind(this), refreshDeactivateCallback.bind(this), refreshStartCallback.bind(this), refreshBeforeDeactivateCallback.bind(this));
      }
      // registry load
      if (this.mergedOptions.vuescroll.pushLoad.enable) {
        var loadDom = this.$refs["loadDom"].elm || this.$refs["loadDom"];
        if (this.$listeners["load-activate"]) {
          loadActivateCallback = function loadActivateCallback() {
            _this.vuescroll.state.loadStage = "active";
            _this.$emit("load-activate", _this, loadDom);
          };
        }
        if (this.$listeners["load-before-deactivate"]) {
          loadBeforeDeactivateCallback = function loadBeforeDeactivateCallback(done) {
            _this.vuescroll.state.loadStage = "beforeDeactive";
            _this.$emit("load-before-deactivate", _this, loadDom, done.bind(_this.scroller));
          };
        }
        if (this.$listeners["load-deactivate"]) {
          loadDeactivateCallback = function loadDeactivateCallback() {
            _this.vuescroll.state.loadStage = "deactive";
            _this.$emit("load-deactivate", _this, loadDom);
          };
        }
        if (this.$listeners["load-start"]) {
          loadStartCallback = function loadStartCallback() {
            _this.vuescroll.state.loadStage = "start";
            _this.$emit("load-start", _this, loadDom, _this.scroller.finishRefreshOrLoad.bind(_this.scroller));
          };
        }

        var loadHeight = loadDom.scrollHeight;
        this.scroller.activatePushToLoad(loadHeight, loadActivateCallback.bind(this), loadDeactivateCallback.bind(this), loadStartCallback.bind(this), loadBeforeDeactivateCallback.bind(this));
      }
      this.updateScroller();
      return cb;
    },
    updateSlideModeBarState: function updateSlideModeBarState() {
      // update slide mode scrollbars' state
      var heightPercentage = void 0,
          widthPercentage = void 0;
      var vuescroll = this.$el;
      var scroller = this.scroller;
      var outerLeft = 0;
      var outerTop = 0;
      var clientWidth = vuescroll.clientWidth;
      var clientHeight = vuescroll.clientHeight;
      var contentWidth = clientWidth + this.scroller.__maxScrollLeft;
      var contentHeight = clientHeight + this.scroller.__maxScrollTop;
      var __enableScrollX = clientWidth < contentWidth && this.mergedOptions.scrollPanel.scrollingX;
      var __enableScrollY = clientHeight < contentHeight && this.mergedOptions.scrollPanel.scrollingY;
      // out of horizontal bountry 
      if (__enableScrollX) {
        if (scroller.__scrollLeft < 0) {
          outerLeft = -scroller.__scrollLeft;
        } else if (scroller.__scrollLeft > scroller.__maxScrollLeft) {
          outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
        }
      }
      // out of vertical bountry
      if (__enableScrollY) {
        if (scroller.__scrollTop < 0) {
          outerTop = -scroller.__scrollTop;
        } else if (scroller.__scrollTop > scroller.__maxScrollTop) {
          outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
        }
      }
      heightPercentage = clientHeight * 100 / (contentHeight + outerTop);
      widthPercentage = clientWidth * 100 / (contentWidth + outerLeft);
      var scrollTop = Math.min(Math.max(0, scroller.__scrollTop), scroller.__maxScrollTop);
      var scrollLeft = Math.min(Math.max(0, scroller.__scrollLeft), scroller.__maxScrollLeft);
      this.vBar.state.posValue = (scrollTop + outerTop) * 100 / vuescroll.clientHeight;
      this.hBar.state.posValue = (scrollLeft + outerLeft) * 100 / vuescroll.clientWidth;
      if (scroller.__scrollLeft < 0) {
        this.hBar.state.posValue = 0;
      }
      if (scroller.__scrollTop < 0) {
        this.vBar.state.posValue = 0;
      }
      this.vBar.state.size = heightPercentage < 100 ? heightPercentage + "%" : 0;
      this.hBar.state.size = widthPercentage < 100 ? widthPercentage + "%" : 0;
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
    axis: function axis() {
      return map[this.type].axis;
    },
    parent: function parent() {
      return this.$parent.$refs;
    }
  },
  render: function render(h) {
    var _extends2,
        _this = this;

    //eslint-disable-line
    var style = _extends((_extends2 = {}, _defineProperty(_extends2, this.bar.posName, 0), _defineProperty(_extends2, this.ops.pos, 0), _defineProperty(_extends2, this.bar.size, this.state.size), _defineProperty(_extends2, this.bar.opsSize, this.ops[this.bar.opsSize]), _defineProperty(_extends2, "background", this.ops.background), _defineProperty(_extends2, "opacity", this.state.opacity), _defineProperty(_extends2, "cursor", "pointer"), _defineProperty(_extends2, "position", "absolute"), _defineProperty(_extends2, "borderRadius", "4px"), _defineProperty(_extends2, "transition", "opacity .5s"), _defineProperty(_extends2, "userSelect", "none"), _extends2), renderTransform(this.type, this.state.posValue));
    var data = {
      style: style,
      class: "vuescroll-" + this.type + "-scrollbar",
      on: {
        mousedown: this.handleMousedown
      }
    };
    if (this.ops.hover) {
      data.on["mouseenter"] = function () {
        _this.$el.style.background = _this.ops.hover;
      };
      data.on["mouseleave"] = function () {
        _this.$el.style.background = _this.ops.background;
      };
    }
    return h("div", data);
  },

  methods: {
    handleMousedown: function handleMousedown(e) {
      e.stopPropagation();
      this.axisStartPos = e[this.bar.client] - this.$el.getBoundingClientRect()[this.bar.posName];
      // tell parent that the mouse has been down.
      this.$emit("setMousedown", true);
      on(document, "mousemove", this.handleMouseMove);
      on(document, "mouseup", this.handleMouseUp);
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
        var delta = e[this.bar.client] - this.parent[this.type + "Rail"].getBoundingClientRect()[this.bar.posName];
        var percent = (delta - this.axisStartPos) / this.parent[this.type + "Rail"][this.bar.offset];
        this.$parent.scrollTo(_defineProperty({}, this.axis.toLowerCase(), this.parent["scrollPanel"].$el[this.bar.scrollSize] * percent), false);
      }
    },
    handleMouseUp: function handleMouseUp() {
      this.$emit("setMousedown", false);
      this.$parent.hideBar();
      this.axisStartPos = 0;
      off(document, "mousemove", this.handleMouseMove);
      off(document, "mouseup", this.handleMouseUp);
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
  var barOffset = parentRef[type + "Bar"].$el[bar.offset];
  var percent = (e[page] - e.target.getBoundingClientRect()[bar.posName] - barOffset / 2) / e.target[bar.offset];
  var pos = parentRef["scrollPanel"].$el[bar.scrollSize] * percent;
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
    var style = (_style = {}, _defineProperty$1(_style, bar.posName, 0), _defineProperty$1(_style, props.ops.pos, 0), _defineProperty$1(_style, bar.size, "100%"), _defineProperty$1(_style, bar.opsSize, props.ops[bar.opsSize]), _defineProperty$1(_style, "background", props.ops.background), _defineProperty$1(_style, "opacity", props.ops.opacity), _defineProperty$1(_style, "position", "absolute"), _defineProperty$1(_style, "cursor", "pointer"), _defineProperty$1(_style, "borderRadius", "4px"), _style);
    var data = {
      style: style,
      class: "vuescroll-" + props.type + "-rail",
      ref: props.type + "Rail",
      on: {
        click: function click(e) {
          handleClickTrack(e, bar, parentRef, props.type, parent);
        }
      }
    };
    return h("div", data);
  }
};

// scrollContent
var scrollContent = {
  name: "scrollContent",
  functional: true,
  render: function render(h, _ref) {
    var props = _ref.props,
        slots = _ref.slots;

    var style = deepMerge(props.state.style, {});
    style.position = "relative";
    style.minHeight = "100%";
    if (props.ops.padding) {
      style[props.ops.paddPos] = props.ops.paddValue;
    }
    return h(props.ops.tag, {
      style: style,
      ref: "scrollContent",
      class: "vuescroll-content",
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
  name: "scrollPanel",
  methods: {
    // trigger scrollPanel options initialScrollX, 
    // initialScrollY
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
    // eslint-disable-line
    var data = {
      class: ["vuescroll-panel"]
    };
    return h(
      "div",
      data,
      [[this.$slots.default]]
    );
  },

  props: {
    ops: {},
    state: {}
  }
};

// vuescroll core component
// refered to: https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
// vue-jsx: https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/example/example.js

// begin importing
// import mix begin.....

// import lefrCycle
// import api
// import native mode
// import slide mode
// import mix end......

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
    style: {
      position: "relative"
    },
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel,
      state: vm.scrollPanel.state
    }
  };
  // set overflow only if the in native mode
  if (vm.mode == "native") {
    // dynamic set overflow scroll
    // feat: #11
    if (vm.mergedOptions.scrollPanel.scrollingY) {
      scrollPanelData.style["overflowY"] = vm.vBar.state.size ? "scroll" : "inherit";
    } else {
      scrollPanelData.style["overflowY"] = vm.vBar.state.size ? "hidden" : "inherit";
    }
    if (vm.mergedOptions.scrollPanel.scrollingX) {
      scrollPanelData.style["overflowX"] = vm.vBar.state.size ? "scroll" : "inherit";
    } else {
      scrollPanelData.style["overflowX"] = vm.vBar.state.size ? "hidden" : "inherit";
    }
    var gutter = getGutter();
    if (!getGutter.isUsed) {
      getGutter.isUsed = true;
    }
    if (!gutter) {
      hideSystemBar();
      scrollPanelData.style.height = "100%";
    } else {
      // hide system bar by use a negative value px
      // for panel and overflow hidden for parent elm,
      // because just hide system bar doesn't work 
      // for firefox. #10
      scrollPanelData.style.marginRight = "-" + gutter + "px";
      // scrollPanelData.style.marginBottom = `-${gutter}px`;
      scrollPanelData.style.height = "calc(100% + " + gutter + "px)";
    }
    // clear legency styles of slide mode...
    scrollPanelData.style.transformOrigin = "";
    scrollPanelData.style.transform = "";
  } else if (vm.mode == "slide") {
    scrollPanelData.style["transformOrigin"] = "left top 0px";
    scrollPanelData.style["userSelect"] = "none";
  }
  return h(
    "scrollPanel",
    scrollPanelData,
    [function () {
      if (vm.mode == "native") {

        return [createContent(h, vm)];
      } else if (vm.mode == "slide") {

        var renderChildren = [vm.$slots.default];
        // handle for refresh
        if (vm.mergedOptions.vuescroll.pullRefresh.enable) {
          // just use user-defined refresh dom instead of default
          if (vm.$slots.refresh) {
            vm.$refs["refreshDom"] = vm.$slots.refresh[0];
            renderChildren.unshift(vm.$slots.refresh[0]);
          } else {
            createRefreshDomStyle();
            var refreshDom = null;
            // front or end of the process.
            if (vm.vuescroll.state.refreshStage == "deactive") {
              refreshDom = h(
                "svg",
                {
                  attrs: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 1000 1000", "enable-background": "new 0 0 1000 1000", xmlSpace: "preserve" }
                },
                [h("metadata", [" Svg Vector Icons : http://www.sfont.cn "]), h("g", [h(
                  "g",
                  {
                    attrs: { transform: "matrix(1 0 0 -1 0 1008)" }
                  },
                  [h("path", {
                    attrs: { d: "M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z" }
                  })]
                )])]
              );
            }
            // refreshing
            else if (vm.vuescroll.state.refreshStage == "start") {
                refreshDom = h(
                  "svg",
                  {
                    attrs: { version: "1.1", id: "loader-1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px",
                      viewBox: "0 0 50 50", xmlSpace: "preserve" },
                    style: "enable-background:new 0 0 50 50;" },
                  [h(
                    "path",
                    {
                      attrs: { fill: "#000", d: "M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" }
                    },
                    [h("animateTransform", {
                      attrs: { attributeType: "xml",
                        attributeName: "transform",
                        type: "rotate",
                        from: "0 25 25",
                        to: "360 25 25",
                        dur: "0.6s",
                        repeatCount: "indefinite" }
                    })]
                  )]
                );
              }
              // release to refresh, active
              else if (vm.vuescroll.state.refreshStage == "active") {
                  refreshDom = h(
                    "svg",
                    {
                      attrs: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 1000 1000", "enable-background": "new 0 0 1000 1000", xmlSpace: "preserve" }
                    },
                    [h("metadata", [" Svg Vector Icons : http://www.sfont.cn "]), h("g", [h(
                      "g",
                      {
                        attrs: { transform: "matrix(1 0 0 -1 0 1008)" }
                      },
                      [h("path", {
                        attrs: { d: "M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z" }
                      })]
                    )])]
                  );
                }
            // no slot refresh elm, use default
            renderChildren.unshift(h(
              "div",
              { "class": "vuescroll-refresh", ref: "refreshDom", key: "refshDom" },
              [[refreshDom, vm.pullRefreshTip]]
            ));
          }
        }

        // handle for load
        if (vm.mergedOptions.vuescroll.pushLoad.enable) {
          if (vm.$slots.load) {
            vm.$refs["loadDom"] = vm.$slots.load[0];
            renderChildren.push(vm.$slots.load[0]);
          } else {
            createLoadDomStyle();
            var loadDom = null;
            // front or end of the process.
            if (vm.vuescroll.state.loadStage == "deactive") {
              loadDom = h(
                "svg",
                {
                  attrs: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 1000 1000", "enable-background": "new 0 0 1000 1000", xmlSpace: "preserve" }
                },
                [h("metadata", [" Svg Vector Icons : http://www.sfont.cn "]), h("g", [h(
                  "g",
                  {
                    attrs: { transform: "matrix(1 0 0 -1 0 1008)" }
                  },
                  [h("path", {
                    attrs: { d: "M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z" }
                  })]
                )])]
              );
            }
            // loading
            else if (vm.vuescroll.state.loadStage == "start") {
                loadDom = h(
                  "svg",
                  {
                    attrs: { version: "1.1", id: "loader-1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px",
                      viewBox: "0 0 50 50", xmlSpace: "preserve" },
                    style: "enable-background:new 0 0 50 50;" },
                  [h(
                    "path",
                    {
                      attrs: { fill: "#000", d: "M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" }
                    },
                    [h("animateTransform", {
                      attrs: { attributeType: "xml",
                        attributeName: "transform",
                        type: "rotate",
                        from: "0 25 25",
                        to: "360 25 25",
                        dur: "0.6s",
                        repeatCount: "indefinite" }
                    })]
                  )]
                );
              }
              // release to load, active
              else if (vm.vuescroll.state.loadStage == "active") {
                  loadDom = h(
                    "svg",
                    {
                      attrs: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 1000 1000", "enable-background": "new 0 0 1000 1000", xmlSpace: "preserve" }
                    },
                    [h("metadata", [" Svg Vector Icons : http://www.sfont.cn "]), h("g", [h(
                      "g",
                      {
                        attrs: { transform: "matrix(1 0 0 -1 0 1008)" }
                      },
                      [h("path", {
                        attrs: { d: "M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z" }
                      })]
                    )])]
                  );
                }
            // no slot load elm, use default
            renderChildren.push(h(
              "div",
              { "class": "vuescroll-load", ref: "loadDom", key: "loadDom" },
              [[loadDom, vm.pushLoadTip]]
            ));
          }
        }
        return renderChildren;
      }
    }()]
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
    "scrollContent",
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
  var railOptionType = type === "vertical" ? "vRail" : "hRail";
  var barOptionType = type === "vertical" ? "vBar" : "hBar";
  var axis = type === "vertical" ? "Y" : "X";

  var railData = {
    props: {
      type: type,
      ops: vm.mergedOptions[railOptionType],
      state: vm[railOptionType].state
    }
  };
  if (!vm[barOptionType].state.size || !vm.mergedOptions.scrollPanel["scrolling" + axis] || vm.refreshLoad && type !== "vertical" && vm.mode === "slide") {
    return null;
  }
  return h("rail", railData);
}

/**
 * create bars
 * 
 * @param {any} size 
 * @param {any} type 
 */
function createBar(h, vm, type) {
  // hBar data
  var barOptionType = type === "vertical" ? "vBar" : "hBar";
  var axis = type === "vertical" ? "Y" : "X";

  var barData = {
    props: {
      type: type,
      ops: vm.mergedOptions[barOptionType],
      state: vm[barOptionType].state
    },
    on: {
      setMousedown: vm.setMousedown
    },
    ref: type + "Bar"
  };
  if (!vm[barOptionType].state.size || !vm.mergedOptions.scrollPanel["scrolling" + axis] || vm.refreshLoad && type !== "vertical" && vm.mode === "slide") {
    return null;
  }
  return h("bar", barData);
}

var vuescroll = {
  name: "vueScroll",
  mixins: [LifeCycleMix, vuescrollApi, nativeMode, slideMode],
  data: function data() {
    return {
      // vuescroll components' state
      vuescroll: {
        state: {
          isDragging: false,
          // vuescroll internal states
          listeners: [],
          // judge whether the mouse pointer keeps pressing
          // the scrollbar or not, if true, we don't hide the 
          // scrollbar when mouse leave the vuescroll.
          mousedown: false,
          pointerLeave: true,
          timeoutId: 0,
          updateType: "",
          // for  recording the current states of
          // scrollTop and scrollHeight when switching the
          // mode
          internalScrollTop: 0,
          internalScrollLeft: 0,
          // refresh internal state..
          // handle for refresh state
          refreshStage: "deactive",
          loadStage: "deactive"
        }
      },
      scrollPanel: {
        el: "",
        state: {
          left: 0,
          top: 0,
          zoom: 1
        }
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
      mergedOptions: {
        vuescroll: {},
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

    if (vm.shouldStopRender) {
      return h("div", [[vm.$slots["default"]]]);
    }
    // vuescroll data
    var vuescrollData = {
      style: {
        position: "relative",
        height: "100%",
        width: "100%",
        padding: 0,
        overflow: "hidden"
      },
      class: "vue-scroll",
      on: {
        mouseenter: function mouseenter() {
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
          vm.update();
        },
        mouseleave: function mouseleave() {
          vm.vuescroll.state.pointerLeave = true;
          vm.hideBar();
        },
        mousemove: function mousemove() /* istanbul ignore next */{
          vm.vuescroll.state.pointerLeave = false;
          vm.showBar();
          vm.update();
        }
      }
    };
    return h(
      "div",
      vuescrollData,
      [createPanel(h, vm), createRail(h, vm, "vertical"), createBar(h, vm, "vertical"), createRail(h, vm, "horizontal"), createBar(h, vm, "horizontal")]
    );
  },

  computed: {
    scrollPanelElm: function scrollPanelElm() {
      return this.$refs.scrollPanel.$el;
    },
    mode: function mode() {
      return this.mergedOptions.vuescroll.mode;
    },
    pullRefreshTip: function pullRefreshTip() {
      return this.mergedOptions.vuescroll.pullRefresh.tips[this.vuescroll.state.refreshStage];
    },
    pushLoadTip: function pushLoadTip() {
      return this.mergedOptions.vuescroll.pushLoad.tips[this.vuescroll.state.loadStage];
    },
    refreshLoad: function refreshLoad() {
      return this.mergedOptions.vuescroll.pullRefresh.enable || this.mergedOptions.vuescroll.pushLoad.enable;
    }
  },
  methods: {
    // update function 
    // update different modes of states of scrollbar
    update: function update(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.mode == "native") {
        this.updateNativeModeBarState();
      }
      // else branch handle for other mode 
      else if (this.mode == "slide") {
          this.updateSlideModeBarState();
        }
      // emit event
      if (eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
    },

    // when mode changes,
    // update it
    updateMode: function updateMode() {
      var _this = this;

      if (this.uncessaryChanges) {
        this.$nextTick(function () {
          _this.uncessaryChanges = false;
        });
        return;
      }
      var x = this.vuescroll.state.internalScrollLeft;
      var y = this.vuescroll.state.internalScrollTop;
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      if (this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      } else if (this.mode == "native") {
        // remove the transform style attribute
        this.scrollPanelElm.style.transform = "";
        this.scrollPanelElm.style.transformOrigin = "";
      }
      this.scrollTo({
        x: x,
        y: y
      }, false);
    },
    handleScroll: function handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.update("handle-scroll", nativeEvent);
      this.showAndDefferedHideBar();
    },
    showAndDefferedHideBar: function showAndDefferedHideBar() {
      var _this2 = this;

      this.showBar();
      if (this.vuescroll.state.timeoutId) {
        clearTimeout(this.vuescroll.state.timeoutId); //eslint-disable-line
      }
      this.vuescroll.state.timeoutId = setTimeout(function () {
        //eslint-disable-line
        _this2.vuescroll.state.timeoutId = 0;
        _this2.hideBar();
      }, 500);
    },
    emitEvent: function emitEvent(eventType) {
      var nativeEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var scrollPanel$$1 = this.scrollPanelElm;
      var vertical = {
        type: "vertical"
      },
          horizontal = {
        type: "horizontal"
      };
      var scrollTop = scrollPanel$$1.scrollTop;
      var scrollLeft = scrollPanel$$1.scrollLeft;
      if (this.mode == "slide") {
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
      }
      vertical["process"] = scrollTop / (scrollPanel$$1.scrollHeight - scrollPanel$$1.clientHeight);
      horizontal["process"] = scrollLeft / (scrollPanel$$1.scrollWidth - scrollPanel$$1.clientWidth);
      vertical["barSize"] = this.vBar.state.size;
      horizontal["barSize"] = this.hBar.state.size;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    },
    showBar: function showBar() {
      this.vBar.state.opacity = this.mergedOptions.vBar.opacity;
      this.hBar.state.opacity = this.mergedOptions.hBar.opacity;
    },
    hideBar: function hideBar() {
      // when in non-native mode dragging
      // just return
      if (this.vuescroll.state.isDragging) {
        return;
      }
      // add mousedown condition 
      // to prevent from hiding bar while dragging the bar 
      if (!this.mergedOptions.vBar.keepShow && !this.vuescroll.state.mousedown && this.vuescroll.state.pointerLeave) {
        this.vBar.state.opacity = 0;
      }
      if (!this.mergedOptions.hBar.keepShow && !this.vuescroll.state.mousedown && this.vuescroll.state.pointerLeave) {
        this.hBar.state.opacity = 0;
      }
    },
    setMousedown: function setMousedown(val) {
      this.vuescroll.state.mousedown = val;
    },
    registryResize: function registryResize() {
      var _this3 = this;

      if (this.uncessaryChanges) {
        this.$nextTick(function () {
          _this3.uncessaryChanges = false;
        });
        return;
      }
      /* istanbul ignore next */
      {
        if (this.destroyResize) {
          // when toggling the mode
          // we should clean the flag  object.
          this.destroyResize();
        }
        var contentElm = null;
        if (this.mode == "slide") {

          contentElm = this.scrollPanelElm;
        } else if (this.mode == "native") {
          // because we can customize the tag
          // of the scrollContent, so, scrollContent
          // maybe a dom or a component
          if (this.$refs["scrollContent"]._isVue) {
            contentElm = this.$refs["scrollContent"].$el;
          } else {
            contentElm = this.$refs["scrollContent"];
          }
        }
        window.addEventListener("resize", function () {
          //eslint-disable-line
          _this3.update();
          _this3.showAndDefferedHideBar();
          if (_this3.mode == "slide") {
            _this3.updateScroller();
          }
        }, false);
        var funcArr = [function (nativeEvent) {
          /** 
                       *  set updateType to prevent
                       *  the conflict update of the `updated
                       *  hook` of the vuescroll itself. 
                       */
          _this3.vuescroll.state.updateType = "resize";
          if (_this3.mode == "slide") {
            _this3.updateScroller();
          }
          _this3.update("handle-resize", nativeEvent);
          _this3.showAndDefferedHideBar();
        }];
        // registry resize event
        // because scrollContent is a functional component
        // so it maybe a component or a dom element
        this.destroyResize = listenResize(contentElm, funcArr);
      }
    },
    recordCurrentPos: function recordCurrentPos() {
      var reverse = false;
      if (this.mode !== this.lastMode) {
        reverse = true;
        this.lastMode = this.mode;
      }
      // record the scrollLeft and scrollTop
      // by judging the last mode
      if (this.mode == "native") {
        this.vuescroll.state.internalScrollLeft = reverse ? this.scroller.__scrollLeft : this.scrollPanelElm.scrollLeft;
        this.vuescroll.state.internalScrollTop = reverse ? this.scroller.__scrollTop : this.scrollPanelElm.scrollTop;
      } else if (this.mode == "slide") {
        this.vuescroll.state.internalScrollLeft = reverse ? this.scrollPanelElm.scrollLeft : this.scroller.__scrollLeft;
        this.vuescroll.state.internalScrollTop = reverse ? this.scrollPanelElm.scrollTop : this.scroller.__scrollTop;
      }
    },

    // breaking changes should registry scrollor or native 
    // again
    watchBreakingChanges: function watchBreakingChanges() {
      var _this4 = this;

      // react to vuescroll's change.
      this.$watch("mergedOptions", function () {
        // record current position
        _this4.recordCurrentPos();
        _this4.$nextTick(function () {
          // update scroll..
          _this4.registryResize();
          _this4.updateMode();
        });
      }, {
        deep: true,
        sync: true
      });
    },

    // when small changes , we don't need to
    // registry the scrollor 
    watchUncessaryChanges: function watchUncessaryChanges() {
      var _this5 = this;

      // some uncessary changes.
      ["mergedOptions.vuescroll.pullRefresh.tips", "mergedOptions.vuescroll.pushLoad.tips", "mergedOptions.vRail", "mergedOptions.hRail", "mergedOptions.vBar", "mergedOptions.hBar"].forEach(function (opts) {
        _this5.$watch(opts, function () {
          // record current position
          // reverse: true
          _this5.uncessaryChanges = true;
        }, {
          sync: true,
          deep: true
        });
      });
    }
  },
  mounted: function mounted() {
    // do something once mounted
    if (!this._isDestroyed && !this.shouldStopRender) {
      if (this.mode == "slide") {
        this.destroyScroller = this.registryScroller();
      }
      // trace the mode
      this.lastMode = this.mode;
      // registry resize event
      this.registryResize();
      this.watchBreakingChanges();
      this.watchUncessaryChanges();
      // update state
      this.update();
      this.showAndDefferedHideBar();
    }
  },
  updated: function updated() {
    var _this6 = this;

    this.$nextTick(function () {
      if (!_this6._isDestroyed) {
        /* istanbul ignore if */
        if (_this6.vuescroll.state.updateType == "resize") {
          _this6.vuescroll.state.updateType = "";
          return;
        }
        _this6.update();
        _this6.showAndDefferedHideBar();
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
          vuescroll: {},
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
      console.warn("You should not install the vuescroll again!"); //eslint-disable-line
      return;
    }
    //vueScroll
    Vue$$1.component(vuescroll.name, vuescroll);

    // registry the globe setting
    // feat: #8
    Vue$$1.prototype.$vuescrollConfig = deepMerge(GCF, {});

    scroll.isInstalled = true;
  }
};
/* istanbul ignore if */
if (typeof Vue !== "undefined" && "es" === "umd") {
  Vue.use(scroll);
}

export default scroll;
