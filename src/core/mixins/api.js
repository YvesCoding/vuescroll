import { warn, isChildInParent, getNumericValue } from 'shared/util';

export default {
  mounted() {
    vsInstances[this._uid] = this;
  },
  beforeDestroy() {
    delete vsInstances[this._uid];
  },
  methods: {
    // public api
    scrollTo({ x, y }, speed, easing) {
      // istanbul ignore if
      if (speed === true || typeof speed == 'undefined') {
        speed = this.mergedOptions.scrollPanel.speed;
      }
      this.internalScrollTo(x, y, speed, easing);
    },
    scrollBy({ dx = 0, dy = 0 }, speed, easing) {
      let { scrollLeft = 0, scrollTop = 0 } = this.getPosition();
      if (dx) {
        scrollLeft += getNumericValue(
          dx,
          this.scrollPanelElm.scrollWidth - this.$el.clientWidth
        );
      }
      if (dy) {
        scrollTop += getNumericValue(
          dy,
          this.scrollPanelElm.scrollHeight - this.$el.clientHeight
        );
      }
      this.internalScrollTo(scrollLeft, scrollTop, speed, easing);
    },
    scrollIntoView(elm, animate = true) {
      const parentElm = this.$el;

      if (typeof elm === 'string') {
        elm = parentElm.querySelector(elm);
      }

      if (!isChildInParent(elm, parentElm)) {
        warn(
          'The element or selector you passed is not the element of Vuescroll, please pass the element that is in Vuescroll to scrollIntoView API. '
        );
        return;
      }

      // parent elm left, top
      const { left, top } = this.$el.getBoundingClientRect();
      // child elm left, top
      const { left: childLeft, top: childTop } = elm.getBoundingClientRect();

      const diffX = left - childLeft;
      const diffY = top - childTop;

      this.scrollBy(
        {
          dx: -diffX,
          dy: -diffY
        },
        animate
      );
    },
    refresh() {
      this.refreshInternalStatus();
      // refresh again to keep status is correct
      this.$nextTick(this.refreshInternalStatus);
    }
  }
};

/** Public Api */

/**
 * Refresh all
 */
const vsInstances = {};
export function refreshAll() {
  for (let vs in vsInstances) {
    vsInstances[vs].refresh();
  }
}
