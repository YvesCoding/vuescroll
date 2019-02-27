export function listenContainer(
  container,
  scroller,
  eventCallback,
  zooming,
  preventDefault,
  preventDefaultOnMove
) {
  let destroy = null;
  // for touch
  function touchstart(e) {
    // Don't react if initial down happens on a form element
    if (
      (e.touches[0] &&
        e.touches[0].target &&
        e.touches[0].target.tagName.match(/input|textarea|select/i)) ||
      scroller.__disable
    ) {
      return;
    }
    eventCallback('mousedown');
    scroller.doTouchStart(e.touches, e.timeStamp);
    if (preventDefault) {
      e.preventDefault();
    }

    e.stopPropagation();
    // here , we want to manully prevent default, so we
    // set passive to false
    // see https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
    document.addEventListener('touchmove', touchmove, { passive: false });
  }
  function touchmove(e) {
    if (scroller.__disable) return;

    eventCallback('mousemove');
    scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    if (preventDefaultOnMove) {
      e.preventDefault();
    }
  }
  function touchend(e) {
    eventCallback('mouseup');
    scroller.doTouchEnd(e.timeStamp);
    document.removeEventListener('touchmove', touchmove);
  }
  function touchcancel(e) {
    scroller.doTouchEnd(e.timeStamp);
  }

  // for mouse
  function mousedownEvent(e) {
    if (
      e.target.tagName.match(/input|textarea|select/i) ||
      scroller.__disable
    ) {
      return;
    }

    e.stopPropagation();

    eventCallback('mousedown');
    scroller.doTouchStart(
      [
        {
          pageX: e.pageX,
          pageY: e.pageY
        }
      ],
      e.timeStamp
    );

    if (preventDefault) {
      e.preventDefault();
    }

    mousedown = true;
  }
  function mousemove(e) {
    if (!mousedown || scroller.__disable) {
      return;
    }
    eventCallback('mousemove');
    scroller.doTouchMove(
      [
        {
          pageX: e.pageX,
          pageY: e.pageY
        }
      ],
      e.timeStamp
    );
    if (preventDefaultOnMove) {
      e.preventDefault();
    }
    mousedown = true;
  }
  function mouseup(e) {
    if (!mousedown) {
      return;
    }
    eventCallback('mouseup');
    scroller.doTouchEnd(e.timeStamp);

    mousedown = false;
  }
  function zoomHandle(e) {
    scroller.doMouseZoom(
      e.detail ? e.detail * -120 : e.wheelDelta,
      e.timeStamp,
      e.pageX,
      e.pageY
    );
  }
  if ('ontouchstart' in window) {
    container.addEventListener('touchstart', touchstart, false);

    document.addEventListener('touchend', touchend, false);

    document.addEventListener('touchcancel', touchcancel, false);

    destroy = function() {
      container.removeEventListener('touchstart', touchstart, false);

      document.removeEventListener('touchend', touchend, false);

      document.removeEventListener('touchcancel', touchcancel, false);
    };
  } else {
    var mousedown = false;

    container.addEventListener('mousedown', mousedownEvent, false);

    document.addEventListener('mousemove', mousemove, false);

    document.addEventListener('mouseup', mouseup, false);
    if (zooming) {
      container.addEventListener(
        navigator.userAgent.indexOf('Firefox') > -1
          ? 'DOMMouseScroll'
          : 'mousewheel',
        zoomHandle,
        false
      );
    }
    // container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
    //     scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
    // }, false);
    destroy = function() {
      container.removeEventListener('mousedown', mousedownEvent, false);
      document.removeEventListener('mousemove', mousemove, false);
      document.removeEventListener('mouseup', mouseup, false);
      container.removeEventListener(
        navigator.userAgent.indexOf('Firefox') > -1
          ? 'DOMMouseScroll'
          : 'mousewheel',
        zoomHandle,
        false
      );
    };
  }
  // handle __publish event
  scroller.onScroll = () => {
    eventCallback('onscroll');
  };
  return destroy;
}
