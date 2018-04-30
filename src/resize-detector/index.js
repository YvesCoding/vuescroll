// detect content size change 
// https://github.com/wnr/element-resize-detector/blob/465fe68efbea85bb9fe22db2f68ebc7fde8bbcf5/src/detection-strategy/object.js
// modified by wangyi7099
import { eventCenter } from "../util";
export function listenResize(element, func) {
  var OBJECT_STYLE = "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;";
  var object = document.createElement("object");
  object.style.cssText = OBJECT_STYLE;
  object.tabIndex = -1;
  object.type = "text/html";
  object.data = "about:blank";
  object.onload = () => {
    eventCenter(
      object.contentDocument.defaultView,
      "resize",
      func
    );
  };
  element.appendChild(object);
  return function destroy() {
    if(object.contentDocument) {
      eventCenter(
        object.contentDocument.defaultView,
        "resize",
        func,
        "off"
      );
    }
    element.removeChild(object);
  };
}