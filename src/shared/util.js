import Vue from 'vue';

/* istanbul ignore next */
export const isServer = () => Vue.prototype.$isServer;

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

export function deepMerge(from, to, force) {
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
      if (typeof to[key] === 'undefined' || force) to[key] = from[key];
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

export function getAccurateSize(dom, vague = false) {
  let clientWidth;
  let clientHeight;
  try {
    clientWidth = +window.getComputedStyle(dom).width.slice(0, -2);
    clientHeight = +window.getComputedStyle(dom).height.slice(0, -2);
  } catch (error) /* istanbul ignore next */ {
    clientWidth = dom.clientWidth;
    clientHeight = dom.clientHeight;
  }
  if (vague) {
    clientHeight = Math.round(clientHeight);
    clientWidth = Math.round(clientWidth);
  }
  return {
    clientHeight,
    clientWidth
  };
}

let scrollBarWidth;
export function getGutter() {
  /* istanbul ignore next */
  if (isServer()) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const { offsetWidth, clientWidth } = outer;

  scrollBarWidth = offsetWidth - clientWidth;

  document.body.removeChild(outer);
  return scrollBarWidth;
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

export const error = msg => {
  console.error(`[vuescroll] ${msg}`);
};
export const warn = msg => {
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

export function isSupportTouch() {
  /* istanbul ignore if */
  if (isServer()) return false;
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

export function isSupportGivenStyle(property, value) {
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

export function isIE() {
  /* istanbul ignore if */
  if (isServer()) return false;

  var agent = navigator.userAgent.toLowerCase();
  return (
    agent.indexOf('msie') !== -1 ||
    agent.indexOf('trident') !== -1 ||
    agent.indexOf(' edge/') !== -1
  );
}

/**
 * Insert children into user-passed slot at vnode level
 */
export function insertChildrenIntoSlot(h, parentVnode, childVNode, data) {
  parentVnode = parentVnode[0] ? parentVnode[0] : parentVnode;

  const isComponent = !!parentVnode.componentOptions;
  const tag = isComponent ? parentVnode.componentOptions.tag : parentVnode.tag;
  const _data = parentVnode.componentOptions || parentVnode.data || {};
  childVNode = childVNode || [];
  parentVnode.children = parentVnode.children || [];
  childVNode = [...childVNode, ...parentVnode.children];

  if (isComponent) {
    data.nativeOn = data.on;
    _data.props = _data.propsData;

    delete data.on;
    delete data.propsData;
  }

  return h(
    tag,
    {
      ...data,
      ..._data
    },
    childVNode
  );
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

export const isArray = _ => Array.isArray(_);
