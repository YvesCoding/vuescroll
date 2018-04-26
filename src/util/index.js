import Vue from "vue";
import scrollMap from "../config/scroll-map";
/**
 * @description deepCopy a object.
 * 
 * @param {any} source 
 * @returns 
 */
export function deepCopy(source, target) {
  target = typeof target === "object"&&target || {};
  for (var key in source) {
    target[key] = typeof source[key] === "object" ? deepCopy(source[key], target[key] = {}) : source[key];
  }
  return target;
}

/**
 * 
 * @description deepMerge a object.
 * @param {any} from 
 * @param {any} to 
 */
export function deepMerge(from, to) {
  to = to || {};
  for (var key in from) {
    if (typeof from[key] === "object") {
      if (typeof(to[key]) === "undefined") {
        to[key] = {};
        deepCopy(from[key], to[key]);
      } else {
        deepMerge(from[key], to[key]);
      }
    } else {
      if(typeof(to[key]) === "undefined")
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
export function defineReactive(target, key, source, souceKey) {
  let getter = null;
  if(!source[key] && typeof source !== "function") {
    return;
  }
  souceKey = souceKey || key;
  if(typeof source === "function") {
    getter = source;
  }
  Object.defineProperty(target, key, {
    get: getter || function() {
      return source[souceKey];
    },
    configurable: true
  });
}

let scrollBarWidth;

export function getGutter() {
  /* istanbul ignore next */
  if (Vue.prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";
  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;
  getGutter.isUsed = false;
  return scrollBarWidth;
}

// for macOs user, the gutter will be 0,
// so, we hide the system scrollbar
let haveHideen = false;
let haveCreatedRefreshDomClass = false;
let haveCreatedLoadDomClass = false;
export function hideSystemBar() {
  if(haveHideen) {
    return;
  }
  haveHideen = true;
  let styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML=".vuescroll-panel::-webkit-scrollbar{width:0;height:0}";
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
}

export function createRefreshDomStyle() {
  if(haveCreatedRefreshDomClass) {
    return;
  }
  haveCreatedRefreshDomClass = true;
  let styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML=`
    .vuescroll-refresh {
        color: black;
        height: 50px;
        text-align: center;
        font-size: 16px;
        line-height: 50px;
    }
    .vuescroll-refresh svg {
        margin-right: 10px;
        width: 25px;
        height: 25px;
        vertical-align: sub;
    }
    .vuescroll-refresh svg path,
    .vuescroll-refresh svg rect{
    fill: #FF6700;
    }
    `;
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
}

export function createLoadDomStyle() {
  if(haveCreatedLoadDomClass) {
    return;
  }
  haveCreatedLoadDomClass = true;
  let styleDom = document.createElement("style");
  styleDom.type = "text/css";
  styleDom.innerHTML=`
        .vuescroll-load {
            color: black;
            height: 50px;
            text-align: center;
            font-size: 16px;
            line-height: 50px;
        }
        .vuescroll-load svg {
            margin-right: 10px;
            width: 25px;
            height: 25px;
            vertical-align: sub;
        }
        .vuescroll-load svg path,
        .vuescroll-load svg rect{
        fill: #FF6700;
        }
        `;
  document.getElementsByTagName("HEAD").item(0).appendChild(styleDom);
}
/**
 * @description render bar's style
 * @author wangyi
 * @export
 * @param {any} type vertical or horizontal
 * @param {any} posValue The position value
 */
export function renderTransform(type, posValue) {
  return {
    transform: `translate${scrollMap[type].axis}(${posValue}%)`,
    msTransform: `translate${scrollMap[type].axis}(${posValue}%)`,
    webkitTransform: `translate${scrollMap[type].axis}(${posValue}%)`
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
export function on(
  dom,
  eventName,
  hander,
  capture = false
) {
  dom.addEventListener(
    eventName,
    hander,
    capture
  );
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
export function off(
  dom,
  eventName,
  hander,
  capture = false
) {
  dom.removeEventListener(
    eventName,
    hander,
    capture
  );
}
/**
 * Calculate the easing pattern
 * @link https://github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js
 * modified by wangyi7099
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
export function easingPattern  (easing, time) {
  let pattern = null;
  /* istanbul ignore next */
  {
    // Default Easing Patterns
    if (easing === "easeInQuad") pattern = time * time; // accelerating from zero velocity
    if (easing === "easeOutQuad") pattern = time * (2 - time); // decelerating to zero velocity
    if (easing === "easeInOutQuad") pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if (easing === "easeInCubic") pattern = time * time * time; // accelerating from zero velocity
    if (easing === "easeOutCubic") pattern = (--time) * time * time + 1; // decelerating to zero velocity
    if (easing === "easeInOutCubic") pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if (easing === "easeInQuart") pattern = time * time * time * time; // accelerating from zero velocity
    if (easing === "easeOutQuart") pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
    if (easing === "easeInOutQuart") pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
    if (easing === "easeInQuint") pattern = time * time * time * time * time; // accelerating from zero velocity
    if (easing === "easeOutQuint") pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
    if (easing === "easeInOutQuint") pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
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
export function goScrolling(
  elm,
  deltaX,
  deltaY,
  speed, 
  easing
) {
  let start = null;
  let positionX = null;
  let positionY = null;
  const startLocationY = elm["scrollTop"];
  const startLocationX = elm["scrollLeft"];
  /**
     * keep the limit of scroll delta.
     */
  /* istanbul ignore next */
  {
    if(startLocationY + deltaY < 0) {
      deltaY = -startLocationY;
    }
    if(startLocationY + deltaY > elm["scrollHeight"]) {
      deltaY = elm["scrollHeight"] - startLocationY;
    }
    if(startLocationX + deltaX < 0) {
      deltaX = -startLocationX;
    }
    if(startLocationX + deltaX > elm["scrollWidth"]) {
      deltaX = elm["scrollWidth"] - startLocationX;
    }
  }
  const loopScroll = function(timeStamp) {
    if(!start) {
      start = timeStamp;
    }
    const deltaTime = timeStamp - start;
    let percentage = (deltaTime / speed > 1) ? 1 : deltaTime / speed;
    positionX = startLocationX + (deltaX * easingPattern(easing, percentage));
    positionY = startLocationY + (deltaY * easingPattern(easing, percentage));
    if(Math.abs(positionY - startLocationY) <= Math.abs(deltaY) || Math.abs(positionX - startLocationX) <= Math.abs(deltaX)) {  
      // set scrollTop or scrollLeft
      elm["scrollTop"] = Math.floor(positionY);
      elm["scrollLeft"] = Math.floor(positionX);
      if(percentage < 1) {
        requestAnimationFrame(loopScroll);
      }
    }
  };
  requestAnimationFrame(loopScroll);
}   

// detect content size change 
// https://github.com/wnr/element-resize-detector/blob/465fe68efbea85bb9fe22db2f68ebc7fde8bbcf5/src/detection-strategy/object.js
// modified by wangyi7099
export function listenResize(element, funArr) {
  var OBJECT_STYLE = "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;";
  var object = document.createElement("object");
  object.style.cssText = OBJECT_STYLE;
  object.tabIndex = -1;
  object.type = "text/html";
  object.onload = () => {
    funArr.forEach(func => {
      on(
        object.contentDocument.defaultView,
        "resize",
        func
      );
    });
  };
  element.appendChild(object);
  return function destroy() {
    if(object.contentDocument) {
      funArr.forEach(func => {
        off(
          object.contentDocument.defaultView,
          "resize",
          func
        );
      });
    }
    element.removeChild(object);
  };
}

export function findValuesByMode(mode, vm) {
  let rtnValues = {};
  switch(mode) {
  case "native":
  case "pure-native": rtnValues = {x: vm.scrollPanelElm.scrollLeft, y: vm.scrollPanelElm.scrollTop}; break;
  case "slide": rtnValues = {x: vm.scroller.__scrollLeft, y: vm.scroller.__scrollTop}; break;
  }
  return rtnValues;
}