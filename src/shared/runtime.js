import { isServer, mergeObject } from './utils';
import { ZoomManager } from './zoomManager';
import { h } from 'vue';

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
  parentVnodeFunc,
  childVNodeFunc,
  data = {}
) {
  const parentVnode = parentVnodeFunc();
  const childVNode = childVNodeFunc();
  /* istanbul ignore if */
  if (parentVnode && parentVnode.length > 1) {
    return () => [...parentVnode, ...childVNode];
  }

  let { ch, tag } = getVnodeInfo(parentVnode);

  const newCh = () => [...ch, ...childVNode];

  return h(
    tag,
    mergeObject(
      data,
      parentVnode[0].props || {}, // merge our props and the props that user passed to custom component.
      false,
      true
    ),
    {
      default: newCh
    }
  );
}

/**
 *  Get the info of a vnode,
 * vnode must be parentVnode
 */
export function getVnodeInfo(vnode) {
  /* istanbul ignore if */
  if (!vnode || vnode.length > 1) return {};

  const firstVnode = vnode[0] ? vnode[0] : vnode;
  let ch;
  let tag;

  ch = firstVnode.children || [];
  tag = firstVnode.type;

  return {
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
  if (!parent.$data._isVuescrollRoot && parent) {
    parent = parent.$parent;
  }
  return parent;
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

/**
 * Get the children of parent those are in viewport
 */
export function getCurrentViewportDom(parent, container) {
  const children = parent.children;
  const domFragment = [];

  const isCurrentview = (dom) => {
    const { left, top, width, height } = dom.getBoundingClientRect();
    const {
      left: parentLeft,
      top: parentTop,
      height: parentHeight,
      width: parentWidth
    } = container.getBoundingClientRect();
    if (
      left - parentLeft + width > 0 &&
      left - parentLeft < parentWidth &&
      top - parentTop + height > 0 &&
      top - parentTop < parentHeight
    ) {
      return true;
    }
    return false;
  };

  for (let i = 0; i < children.length; i++) {
    const dom = children.item(i);
    if (isCurrentview(dom) && !dom.isResizeElm) {
      domFragment.push(dom);
    }
  }
  return domFragment;
}
