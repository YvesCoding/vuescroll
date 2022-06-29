/**
 * ZoomManager
 * Get the browser zoom ratio
 */

export default class ZoomManager {
  constructor() {
    this.originPixelRatio = this.getRatio();
    this.lastPixelRatio = this.originPixelRatio;
    window.addEventListener('resize', () => {
      this.lastPixelRatio = this.getRatio();
    });
  }
  getRatio() {
    let ratio = 0;
    const screen = window.screen;
    const ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI;
      }
    } else if (
      window.outerWidth !== undefined &&
      window.innerWidth !== undefined
    ) {
      ratio = window.outerWidth / window.innerWidth;
    }

    if (ratio) {
      ratio = Math.round(ratio * 100);
    }

    return ratio;
  }
  getRatioBetweenPreAndCurrent() {
    return this.originPixelRatio / this.lastPixelRatio;
  }
}
