import { createEasingFunction,  easingPattern} from "../easingPattern";
import { core } from "../scroller/animate";

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

export function goScrolling(
  elm,
  deltaX,
  deltaY,
  speed, 
  easing,
  scrollingComplete
) {
  const startLocationY = elm["scrollTop"];
  const startLocationX = elm["scrollLeft"];
  let positionX = startLocationX;
  let positionY = startLocationY;
  /**
     * keep the limit of scroll delta.
     */
  /* istanbul ignore next */
  if(startLocationY + deltaY < 0) {
    deltaY = -startLocationY;
  }
  if(startLocationY + deltaY > elm["scrollHeight"]) {
    deltaY = elm["scrollHeight"] - startLocationY;
  }
  if(startLocationX + deltaX < 0) {
    deltaX = -startLocationX;
  }
  if(startLocationX + deltaX > elm["scrollWidth"]) {
    deltaX = elm["scrollWidth"] - startLocationX;
  }

  const easingMethod = createEasingFunction(easing, easingPattern);
  const stepCallback = (percentage) => {
    positionX = startLocationX + (deltaX * percentage);
    positionY = startLocationY + (deltaY * percentage);
    elm["scrollTop"] = Math.floor(positionY);
    elm["scrollLeft"] = Math.floor(positionX);
    return verifyCallback();
  };
  const verifyCallback = () => {
    return  Math.abs(positionY - startLocationY) < Math.abs(deltaY) || Math.abs(positionX - startLocationX) < Math.abs(deltaX);
  };
  core.effect.Animate.start(
    stepCallback, 
    verifyCallback, 
    scrollingComplete, 
    speed, 
    easingMethod
  );
}

export default {
  methods: {
    scrollTo({x, y}, animate = true, force = false) {
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
      this.internalScrollTo(x, y, animate, force);
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
    internalScrollTo(destX, destY, animate, force) {
      if(this.mode == "native" || this.mode == "pure-native") {
        if(animate) {
          // hadnle for scroll complete
          const scrollingComplete = () => {
            this.update("handle-scroll-complete");
          };
          goScrolling(
            this.$refs["scrollPanel"].$el,
            destX - this.$refs["scrollPanel"].$el.scrollLeft,
            destY - this.$refs["scrollPanel"].$el.scrollTop,
            this.mergedOptions.scrollPanel.speed,
            this.mergedOptions.scrollPanel.easing,
            scrollingComplete
          );
        } else {
          this.$refs["scrollPanel"].$el.scrollTop = destY;
          this.$refs["scrollPanel"].$el.scrollLeft = destX;
        }
      } 
      // for non-native we use scroller's scorllTo 
      else if(this.mode == "slide"){
        this.scroller.scrollTo(destX, destY, animate, undefined, force);
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