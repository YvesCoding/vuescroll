import nativeApi from 'mode/native/mixins/api';
import slideApi from 'mode/slide/mixins/api';

export default {
  // mix slide and nitive modes apis.
  mixins: [slideApi, nativeApi],
  methods: {
    // private api
    internalScrollTo(destX, destY, speed, easing) {
      if (this.mode == 'native') {
        this.nativeScrollTo(destX, destY, speed, easing);
      }
      // for non-native we use scroller's scorllTo
      else if (this.mode == 'slide') {
        this.slideScrollTo(destX, destY, speed, easing);
      }
    },
    stop() {
      this.nativeStop();
    },
    pause() {
      this.nativePause();
    },
    continue() {
      this.nativeContinue();
    },
    getCurrentviewDom() {
      return this.mode == 'slide'
        ? this.getCurrentviewDomSlide()
        : this.getCurrentviewDomNative();
    }
  }
};
