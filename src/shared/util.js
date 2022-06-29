import { isIE, isIos, touchManager, isServer } from './env';
export { isIE, isIos, touchManager, isServer };
import ZoomManager from './zoomManager';

export function deepCopy(from, to, shallow) {
  if (shallow && isUndef(to)) {
    return from;
  }

  if (isArray(from)) {
    to = [];
    from.forEach((item, index) => {
      to[index] = deepCopy(item, to[index]);
    });
  } else if (from) {
    if (!isPlainObj(from)) {
      return from;
    }
    to = {};
    for (let key in from) {
      to[key] =
        typeof from[key] === 'object'
          ? deepCopy(from[key], to[key])
          : from[key];
    }
  }
  return to;
}

export function mergeObject(from, to, force, shallow) {
  if (shallow && isUndef(to)) {
    return from;
  }

  to = to || {};

  if (isArray(from)) {
    if (!isArray(to) && force) {
      to = [];
    }
    if (isArray(to)) {
      from.forEach((item, index) => {
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
        if (typeof from[key] === 'object') {
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

export function defineReactive(target, key, source, souceKey) {
  /* istanbul ignore if */
  if (!source[key] && typeof source !== 'function') {
    return;
  }
  souceKey = souceKey || key;
  Object.defineProperty(target, key, {
    get() {
      return source[souceKey];
    },
    configurable: true
  });
}

let scrollBarWidth;
let zoomManager;
export function getGutter() {
  /* istanbul ignore next */
  if (isServer()) return 0;
  if (!zoomManager) {
    zoomManager = new ZoomManager();
  }
  if (scrollBarWidth !== undefined)
    return scrollBarWidth * zoomManager.getRatioBetweenPreAndCurrent();
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
  // multi the browser zoom
  if (!zoomManager) {
    zoomManager = new ZoomManager();
  }
  return scrollBarWidth * zoomManager.getRatioBetweenPreAndCurrent();
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

export const error = (msg) => {
  console.error(`[vuescroll] ${msg}`);
};
export const warn = (msg) => {
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
  } /* istanbul ignore next */ else if (
    typeof navigator.cpuClass === 'string'
  ) {
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

export function getComplitableStyle(property, value) {
  /* istanbul ignore if */
  if (isServer()) return false;

  const compatibleValue = `-${getPrefix(window)}-${value}`;
  const testElm = document.createElement('div');
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
export function insertChildrenIntoSlot(
  h,
  parentVnode = [],
  childVNode = [],
  data = {},
  swapChildren
) {
  /* istanbul ignore if */
  if (parentVnode && parentVnode.length > 1) {
    return swapChildren
      ? [...childVNode, ...parentVnode]
      : [...parentVnode, ...childVNode];
  }

  parentVnode = parentVnode[0];
  let { ch, tag, isComponent } = getVnodeInfo(parentVnode);
  if (isComponent) {
    parentVnode.data = mergeObject(
      { attrs: parentVnode.componentOptions.propsData },
      parentVnode.data,
      false, // force: false
      true // shallow: true
    );
  }
  ch = swapChildren ? [...childVNode, ...ch] : [...ch, ...childVNode];
  delete parentVnode.data.slot;

  return h(tag, mergeObject(data, parentVnode.data, false, true), ch);
}

/**
 *  Get the info of a vnode,
 * vnode must be parentVnode
 */
export function getVnodeInfo(vnode) {
  if (!vnode || vnode.length > 1) return {};

  vnode = vnode[0] ? vnode[0] : vnode;
  const isComponent = !!vnode.componentOptions;
  let ch;
  let tag;

  if (isComponent) {
    ch = vnode.componentOptions.children || [];
    tag = vnode.componentOptions.tag;
  } else {
    ch = vnode.children || [];
    tag = vnode.tag;
  }

  return {
    isComponent,
    ch,
    tag
  };
}

/**
 * Get the vuescroll instance instead of
 * user pass component like slot.
 */
export function getRealParent(ctx) {
  let parent = ctx.$parent;
  if (!parent._isVuescrollRoot && parent) {
    parent = parent.$parent;
  }
  return parent;
}

export const isArray = (_) => Array.isArray(_);
export const isPlainObj = (_) =>
  Object.prototype.toString.call(_) == '[object Object]';
export const isUndef = (_) => typeof _ === 'undefined';

export function getNumericValue(distance, size) {
  let number;
  if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = (size * number) / 100;
  }
  return number;
}

export function createStyle(styleId, cssText) {
  /* istanbul ignore if */
  if (isServer() || document.getElementById(styleId)) {
    return;
  }

  const head = document.head || doc.getElementsByTagName('head')[0];
  const style = document.createElement('style');

  style.id = styleId;
  style.type = 'text/css';

  /* istanbul ignore if */
  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }

  head.appendChild(style);
}

// Hide the ios native scrollbar.
export function createHideBarStyle() {
  /* istanbul ignore next */
  {
    const cssText = `.__hidebar::-webkit-scrollbar {
      width: 0;
      height: 0;
    }`;

    createStyle('vuescroll-hide-ios-bar', cssText);
  }
}

// create slide mode style
export function createSlideModeStyle() {
  const cssText = `
    @-webkit-keyframes loading-rotate {
      to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn);
      }
    }

    @keyframes loading-rotate {
      to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn);
      }
    }

    @-webkit-keyframes loading-wipe {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }
      to {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }

    @keyframes loading-wipe {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
      }
      to {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
      }
    }

    .__vuescroll .__refresh,
    .__vuescroll .__load {
      position: absolute;
      width: 100%;
      color: black;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
    }
    .__vuescroll .__refresh svg,
    .__vuescroll .__load svg {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      vertical-align: sub;
    }
    .__vuescroll .__refresh svg.active,
    .__vuescroll .__load svg.active {
      transition: all 0.2s;
    }
    .__vuescroll .__refresh svg.active.deactive,
    .__vuescroll .__load svg.active.deactive {
      transform: rotateZ(180deg);
    }
    .__vuescroll .__refresh svg path,
    .__vuescroll .__refresh svg rect,
    .__vuescroll .__load svg path,
    .__vuescroll .__load svg rect {
      fill: #20a0ff;
    }
    .__vuescroll .__refresh svg.start,
    .__vuescroll .__load svg.start {
      stroke: #343640;
      stroke-width: 4;
      stroke-linecap: round;
      -webkit-animation: loading-rotate 2s linear infinite;
      animation: loading-rotate 2s linear infinite;
    }
    .__vuescroll .__refresh svg.start .bg-path,
    .__vuescroll .__load svg.start .bg-path {
      stroke: #f2f2f2;
      fill: none;
    }
    .__vuescroll .__refresh svg.start .active-path,
    .__vuescroll .__load svg.start .active-path {
      stroke: #20a0ff;
      fill: none;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      -webkit-animation: loading-wipe 1.5s ease-in-out infinite;
      animation: loading-wipe 1.5s ease-in-out infinite;
    }
  `;

  createStyle('vuescroll-silde-mode-style', cssText);
}
