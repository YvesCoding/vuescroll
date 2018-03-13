/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export function trigger(elm, name, ...opts) {
  let eventName;
  let evt = null;

  if (/^mouse|click/.test(name)) {
    evt = new MouseEvent(name, ...opts);
  } else if (/^key/.test(name)) {
    evt = new KeyboardEvent(name, ...opts);
  } else {
    evt = new Event(name, ...opts);
  }

  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt);

  return elm;
};
  