/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export default function(elm, name, ...opts) {
    let eventName;
  
    if (/^mouse|click/.test(name)) {
      eventName = 'MouseEvents';
    } else if (/^key/.test(name)) {
      eventName = 'KeyboardEvent';
    } else {
      eventName = 'HTMLEvents';
    }
    const evt = document.createEvent(eventName);
  
    evt.initEvent(name, ...opts);
    elm.dispatchEvent
      ? elm.dispatchEvent(evt)
      : elm.fireEvent('on' + name, evt);
  
    return elm;
  };
  