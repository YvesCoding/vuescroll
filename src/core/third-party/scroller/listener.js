import { touchManager } from 'src/shared/env';
const touch = new touchManager();
export function listenContainer(
  container,
  scroller,
  eventCallback,
  zooming,
  preventDefault,
  preventDefaultOnMove
) {
  let destroy = null;
  let mousedown = false;
  const touchObj = touch.getTouchObject();

  function touchstart(e) {
    const event = touch.getEventObject(e);
    // Don't react if initial down happens on a form element
    if (
      (event[0] &&
        event[0].target &&
        event[0].target.tagName.match(/input|textarea|select/i)) ||
      scroller.__disable
    ) {
      return;
    }
    eventCallback('mousedown');
    mousedown = true;
    scroller.doTouchStart(event, e.timeStamp);

    if (preventDefault) {
      e.preventDefault();
    }
    e.stopPropagation();

    // here , we want to manully prevent default, so we
    // set passive to false
    // see https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
    document.addEventListener(touchObj.touchmove, touchmove, {
      passive: false
    });
  }

  function touchmove(e) {
    if (scroller.__disable || !mousedown) return;

    const event = touch.getEventObject(e);
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
    document.removeEventListener(touchObj.touchmove, touchmove);
  }
  function touchcancel(e) {
    scroller.doTouchEnd(e.timeStamp);
  }

  function zoomHandle(e) {
    scroller.doMouseZoom(
      e.detail ? e.detail * -120 : e.wheelDelta,
      e.timeStamp,
      e.pageX,
      e.pageY
    );
  }

  container.addEventListener(touchObj.touchstart, touchstart, false);

  document.addEventListener(touchObj.touchend, touchend, false);
  document.addEventListener(touchObj.touchcancel, touchcancel, false);

  if (zooming && !touch.isTouch) {
    container.addEventListener(
      navigator.userAgent.indexOf('Firefox') > -1
        ? 'DOMMouseScroll'
        : 'mousewheel',
      zoomHandle,
      false
    );
  }

  destroy = function() {
    container.removeEventListener(touchObj.touchstart, touchstart, false);

    document.removeEventListener(touchObj.touchend, touchend, false);
    document.removeEventListener(touchObj.touchcancel, touchcancel, false);

    container.removeEventListener(
      navigator.userAgent.indexOf('Firefox') > -1
        ? 'DOMMouseScroll'
        : 'mousewheel',
      zoomHandle,
      false
    );
  };

  // handle __publish event
  scroller.onScroll = () => {
    eventCallback('onscroll');
  };
  return destroy;
}
