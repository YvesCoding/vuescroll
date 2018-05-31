import Vue from 'vue';
export function deepCopy(source, target) {
  target = (typeof target === 'object' && target) || {};
  for (var key in source) {
    target[key] =
      typeof source[key] === 'object'
        ? deepCopy(source[key], (target[key] = {}))
        : source[key];
  }
  return target;
}

export function deepMerge(from, to) {
  to = to || {};
  for (var key in from) {
    if (typeof from[key] === 'object') {
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

export function defineReactive(target, key, source, souceKey) {
  let getter = null;
  /* istanbul ignore if */
  if (!source[key] && typeof source !== 'function') {
    return;
  }
  souceKey = souceKey || key;
  if (typeof source === 'function') {
    getter = source;
  }
  Object.defineProperty(target, key, {
    get:
      getter ||
      function() {
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
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;
  return scrollBarWidth;
}

const doneUtil = {
  refreshDomStyle: false,
  loadDomStyle: false,
  hide: false
};
export function hideSystemBar() {
  /* istanbul ignore next */
  {
    if (doneUtil['hide']) {
      return;
    }
    doneUtil['hide'] = true;
    let styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    styleDom.innerHTML =
      '.vuescroll-panel::-webkit-scrollbar{width:0;height:0}';
    document
      .getElementsByTagName('HEAD')
      .item(0)
      .appendChild(styleDom);
  }
}

const styleMap = {};

styleMap['refreshDomStyle'] = `
.vuescroll-refresh {
    position:absolute;
    width: 100%;
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

styleMap['loadDomStyle'] = `
.vuescroll-load {
    position:absolute;
    width: 100%;
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

export function createDomStyle(styleType) {
  if (doneUtil[styleType]) {
    return;
  }
  doneUtil[styleType] = true;
  let styleDom = document.createElement('style');
  styleDom.type = 'text/css';
  styleDom.innerHTML = styleMap[styleType];
  document
    .getElementsByTagName('HEAD')
    .item(0)
    .appendChild(styleDom);
}

export function eventCenter(
  dom,
  eventName,
  hander,
  capture = false,
  type = 'on'
) {
  type == 'on'
    ? dom.addEventListener(eventName, hander, capture)
    : dom.removeEventListener(eventName, hander, capture);
}

export  const error = (msg) => {
  console.error(`[vuescroll] ${msg}`);
};
export  const warn = (msg) => {
  console.warn(`[vuescroll] ${msg}`);
};
 
export function isChildInParent(child, parent) {
  let flag = false;
  if (!child || !parent) {
    return flag;
  }
  while (
    child.parentNode !== parent &&
    child.parentNode.nodeType !== 9 &&
    !child.parentNode._isVuescroll
  ) {
    child = child.parentNode;
  }
  if (child.parentNode == parent) {
    flag = true;
  }
  return flag;
}

const pxValueReg = /(.*?)px/;
export function extractNumberFromPx(value) {
  const _return = pxValueReg.exec(value);
  return _return && _return[1];
}

export function isSupportTouch() {
  return 'ontouchstart' in window;
}

export function getPrefix(global) {
  var docStyle = document.documentElement.style;
  var engine;
  /* istanbul ignore if */
  if (
    global.opera &&
    Object.prototype.toString.call(opera) === '[object Opera]'
  ) {
    engine = 'presto';
  } /* istanbul ignore next */ else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  }  /* istanbul ignore next */else if (typeof navigator.cpuClass === 'string') {
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

export function isSupportGivenStyle(property, value) {
  const compatibleValue = `-${getPrefix(window)}-${value}`;
  const testElm = document.createElement('div');
  testElm.style[property] = compatibleValue;
  if (testElm.style[property] == compatibleValue)  {
    return compatibleValue;
  }
  /* istanbul ignore next */
  return false;
}