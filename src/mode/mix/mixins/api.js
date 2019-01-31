import nativeApi from 'mode/native/mixins/api';
import slideApi from 'mode/slide/mixins/api';

export default {
  // mix slide and nitive modes apis.
  mixins: [slideApi, nativeApi],
  methods: {
    // private api
    internalScrollTo(destX, destY, animate, force) {
      if (this.mode == 'native') {
        this.nativeScrollTo(destX, destY, animate);
      }
      // for non-native we use scroller's scorllTo
      else if (this.mode == 'slide') {
        this.slideScrollTo(destX, destY, animate, force);
      }
    },
    getCurrentviewDom() {
      return this.mode == 'slide'
        ? this.getCurrentviewDomSlide()
        : this.getCurrentviewDomNative();
    }
  }
};
