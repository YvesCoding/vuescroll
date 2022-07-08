/**
 * TouchManager
 * Get the compatible touch events among different runtime platforms
 */

import { upperFirstChar, isServer } from './utils';

export class TouchManager {
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

    Object.keys(touchObject).forEach((key) => {
      if (key !== 'touch' && key.startsWith('touch')) {
        touchObject['_' + key] = touchObject[key];
        touchObject[key] = 'on' + upperFirstChar(touchObject[key]);
      }
    });

    return (this.touchObject = touchObject);
  }
}
