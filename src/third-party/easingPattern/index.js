/**
 *  Compatible to scroller's animation function
 */
export function createEasingFunction(easing, easingPattern) {
  return function(time) {
    return easingPattern(easing, time);
  };
}

/**
 * Calculate the easing pattern
 * @link https://github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js
 * modified by wangyi7099
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
export function easingPattern(easing, time) {
  let pattern = null;
  /* istanbul ignore next */
  {
    // Default Easing Patterns
    if (easing === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
    if (easing === 'easeInOutQuad')
      pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutCubic') pattern = --time * time * time + 1; // decelerating to zero velocity
    if (easing === 'easeInOutCubic')
      pattern =
        time < 0.5
          ? 4 * time * time * time
          : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuart') pattern = 1 - --time * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuart')
      pattern =
        time < 0.5
          ? 8 * time * time * time * time
          : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuint')
      pattern = 1 + --time * time * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuint')
      pattern =
        time < 0.5
          ? 16 * time * time * time * time * time
          : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
  }
  return pattern || time; // no easing, no acceleration
}
