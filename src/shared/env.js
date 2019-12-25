import Vue from 'vue';

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

export const isIos = () => {
  /* istanbul ignore if */
  if (isServer()) return false;

  let u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

/* istanbul ignore next */
export const isServer = () => Vue.prototype.$isServer;

export class touchManager {
  getEventObject(originEvent) {
    return this.touchObject
      ? this.isTouch
        ? originEvent.touches
        : [originEvent]
      : null;
  }

  getTouchObject() /* istanbul ignore next */ {
    if (isServer()) return null;

    this.isTouch = false;
    const agent = navigator.userAgent,
      platform = navigator.platform,
      touchObject = {};
    touchObject.touch = !!(
      ('ontouchstart' in window && !window.opera) ||
      'msmaxtouchpoints' in window.navigator ||
      'maxtouchpoints' in window.navigator ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
    touchObject.nonDeskTouch =
      (touchObject.touch && !/win32/i.test(platform)) ||
      (touchObject.touch && /win32/i.test(platform) && /mobile/i.test(agent));

    touchObject.eventType =
      'onmousedown' in window && !touchObject.nonDeskTouch
        ? 'mouse'
        : 'ontouchstart' in window
          ? 'touch'
          : 'msmaxtouchpoints' in window.navigator ||
          navigator.msMaxTouchPoints > 0
            ? 'mstouchpoints'
            : 'maxtouchpoints' in window.navigator || navigator.maxTouchPoints > 0
              ? 'touchpoints'
              : 'mouse';
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

    return (this.touchObject = touchObject);
  }
}
