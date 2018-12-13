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

export function isSupportTouch() {
  /* istanbul ignore if */
  if (isServer()) return false;
  return 'ontouchstart' in window;
}

/* istanbul ignore next */
export const isServer = () => Vue.prototype.$isServer;
