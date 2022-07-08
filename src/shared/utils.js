export function upperFirstChar(str) {
  return str.slice(0, 1).toUpperCase() + (str.slice(1) || '');
}

/* istanbul ignore next */
export const isServer = () => typeof window === 'undefined';

export function deepCopy(from, to, shallow) {
  if (shallow && isUndef(to)) {
    return from;
  }

  if (isArray(from)) {
    to = [];
    from.forEach((item, index) => {
      to[index] = deepCopy(item, to[index]);
    });
  } else if (from) {
    if (!isPlainObj(from)) {
      return from;
    }
    to = {};
    for (let key in from) {
      to[key] =
        typeof from[key] === 'object'
          ? deepCopy(from[key], to[key])
          : from[key];
    }
  }
  return to;
}

export function mergeObject(from, to, force, shallow) {
  if (shallow && isUndef(to)) {
    return from;
  }

  to = to || {};

  if (isArray(from)) {
    if (!isArray(to) && force) {
      to = [];
    }
    if (isArray(to)) {
      from.forEach((item, index) => {
        to[index] = mergeObject(item, to[index], force, shallow);
      });
    }
  } else if (from) {
    if (!isPlainObj(from)) {
      if (force) {
        to = from;
      }
    } else {
      for (var key in from) {
        if (typeof from[key] === 'object') {
          if (isUndef(to[key])) {
            to[key] = deepCopy(from[key], to[key], shallow);
          } else {
            mergeObject(from[key], to[key], force, shallow);
          }
        } else {
          if (isUndef(to[key]) || force) to[key] = from[key];
        }
      }
    }
  }

  return to;
}

export function defineReactive(target, key, source, souceKey) {
  /* istanbul ignore if */
  if (!source[key] && typeof source !== 'function') {
    return;
  }
  souceKey = souceKey || key;
  Object.defineProperty(target, key, {
    get() {
      return source[souceKey];
    },
    configurable: true
  });
}

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

export const isArray = (_) => Array.isArray(_);
export const isPlainObj = (_) =>
  Object.prototype.toString.call(_) == '[object Object]';
export const isUndef = (_) => typeof _ === 'undefined';
// do nothing
export const NOOP = () => {};

export function getNumericValue(distance, size) {
  let number;
  if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = (size * number) / 100;
  }
  return number;
}
