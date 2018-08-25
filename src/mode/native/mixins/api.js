import { goScrolling, getCurrentViewportDom } from 'mode/shared/util';

export default {
  methods: {
    nativeScrollTo(destX, destY, animate) {
      if (animate) {
        // hadnle for scroll complete
        const scrollingComplete = this.scrollingComplete.bind(this);

        goScrolling(
          this.$refs['scrollPanel'].$el,
          destX - this.$refs['scrollPanel'].$el.scrollLeft,
          destY - this.$refs['scrollPanel'].$el.scrollTop,
          this.mergedOptions.scrollPanel.speed,
          this.mergedOptions.scrollPanel.easing,
          scrollingComplete
        );
      } else {
        this.$refs['scrollPanel'].$el.scrollTop = destY;
        this.$refs['scrollPanel'].$el.scrollLeft = destX;
      }
    },

    getCurrentviewDomNative() {
      const parent = this.scrollContentElm;
      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
