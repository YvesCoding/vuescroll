import {
  goScrolling
}from "../util";
/**
 * extract an exact number from given params
 * @param {any} distance 
 * @param {any} scroll 
 * @param {any} el 
 * @returns 
 */
function getNumericValue(distance, size) {
  let number;
  if(!(number = /(-?\d+(?:\.\d+?)?)%$/.exec(distance))) {
    number = distance - 0;
  } else {
    number = number[1] - 0;
    number = size * number / 100;
  }
  return number;
}

export default {
  methods: {
    scrollTo({x, y}, animate = true) {
      if(typeof x === "undefined") {
        x = this.vuescroll.state.internalScrollLeft;
      } else {
        x = getNumericValue(x, this.scrollPanelElm.scrollWidth);
      }
      if(typeof y === "undefined") {
        y = this.vuescroll.state.internalScrollTop;
      } else {
        y = getNumericValue(y, this.scrollPanelElm.scrollHeight);
      }
      this.internalScrollTo(x, y, animate);
    },
    scrollBy({dx, dy}, animate = true) {
      let {internalScrollLeft, internalScrollTop} = this.vuescroll.state;
      if(dx) {
        internalScrollLeft += getNumericValue(dx, this.scrollPanelElm.scrollWidth);
      }
      if(dy) {
        internalScrollTop += getNumericValue(dy, this.scrollPanelElm.scrollHeight);
      }
      this.internalScrollTo(internalScrollLeft, internalScrollTop, animate);
    },
    internalScrollTo(destX, destY, animate) {
      if(this.mode == "native") {
        if(animate) {
          goScrolling(
            this.$refs["scrollPanel"].$el,
            destX - this.$refs["scrollPanel"].$el.scrollLeft,
            destY - this.$refs["scrollPanel"].$el.scrollTop,
            this.mergedOptions.scrollPanel.speed,
            this.mergedOptions.scrollPanel.easing
          );
        } else {
          this.$refs["scrollPanel"].$el.scrollTop = destY;
          this.$refs["scrollPanel"].$el.scrollLeft = destX;
        }
      } 
      // for non-native we use scroller's scorllTo 
      else if(this.mode == "slide"){
        this.scroller.scrollTo(destX, destY, animate);
      }
    },
    forceUpdate() {
      this.$forceUpdate();
      Object.keys(this.$refs).forEach(ref => {
        const $ref = this.$refs[ref];
        if($ref._isVue) {
          $ref.$forceUpdate();
        }
      });
    }
  }
};