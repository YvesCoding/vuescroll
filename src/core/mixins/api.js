import { warn, isChildInParent } from 'shared/util';

const vsInstances = {};

export function refreshAll() {
  for (let vs in vsInstances) {
    vsInstances[vs].refresh();
  }
}

function getNumericValue(distance, size) {
  let number;
  if (!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = (size * number) / 100;
  }
  return number;
}

export default {
  mounted() {
    vsInstances[this._uid] = this;
  },
  beforeDestroy() {
    delete vsInstances[this._uid];
  },
  methods: {
    // public api
    scrollTo({ x, y }, animate = true, force = false) {
      if (typeof x === 'undefined') {
        x = this.vuescroll.state.internalScrollLeft || 0;
      } else {
        x = getNumericValue(x, this.scrollPanelElm.scrollWidth);
      }
      if (typeof y === 'undefined') {
        y = this.vuescroll.state.internalScrollTop || 0;
      } else {
        y = getNumericValue(y, this.scrollPanelElm.scrollHeight);
      }
      this.internalScrollTo(x, y, animate, force);
    },
    scrollBy({ dx = 0, dy = 0 }, animate = true) {
      let {
        internalScrollLeft = 0,
        internalScrollTop = 0
      } = this.vuescroll.state;
      if (dx) {
        internalScrollLeft += getNumericValue(
          dx,
          this.scrollPanelElm.scrollWidth
        );
      }
      if (dy) {
        internalScrollTop += getNumericValue(
          dy,
          this.scrollPanelElm.scrollHeight
        );
      }
      this.internalScrollTo(internalScrollLeft, internalScrollTop, animate);
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
    },
    // Get the times you have scrolled!
    getScrollingTimes() {
      return this.vuescroll.state.scrollingTimes;
    },
    // Clear the times you have scrolled!
    clearScrollingTimes() {
      this.vuescroll.state.scrollingTimes = 0;
    }
  }
};
