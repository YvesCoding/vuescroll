// detect content size change
import { eventCenter } from '../../util';
export function listenResize(element, callback) {
  return injectObject(element, callback);
}

function injectObject(element, callback) {
  if(element.hasResized) {
    return;
  }
  var OBJECT_STYLE =
    'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;';
  var object = document.createElement('object');
  element.hasResized = true;
  object.style.cssText = OBJECT_STYLE;
  object.tabIndex = -1;
  object.type = 'text/html';
  object.data = 'about:blank';
  object.isResizeElm = true;
  object.onload = () => {
    eventCenter(object.contentDocument.defaultView, 'resize', callback);
  };
  element.appendChild(object);
  return function destroy() {
    if (object.contentDocument) {
      eventCenter(
        object.contentDocument.defaultView,
        'resize',
        callback,
        'off'
      );
    }
    element.removeChild(object);
    element.hasResized = false;
  };
}
