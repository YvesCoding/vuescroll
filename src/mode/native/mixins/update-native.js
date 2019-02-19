/**
 * These mixes is exclusive for native mode
 */

export default {
  methods: {
    updateNativeModeBarState() {
      const container = this.scrollPanelElm;
      const isPercent = this.vuescroll.state.currentSizeStrategy == 'percent';
      const clientWidth = isPercent
        ? container.clientWidth
        : this.vuescroll.state.width.slice(0, -2); // xxxpx ==> xxx
      const clientHeight = isPercent
        ? container.clientHeight
        : this.vuescroll.state.height.slice(0, -2);

      let heightPercentage = clientHeight / container.scrollHeight;
      let widthPercentage = clientWidth / container.scrollWidth;

      this.bar.vBar.state.posValue = (container.scrollTop * 100) / clientHeight;
      this.bar.hBar.state.posValue = (container.scrollLeft * 100) / clientWidth;

      this.bar.vBar.state.size = heightPercentage < 1 ? heightPercentage : 0;
      this.bar.hBar.state.size = widthPercentage < 1 ? widthPercentage : 0;
    },
    getNativePosition() {
      return {
        scrollTop: this.scrollPanelElm.scrollTop,
        scrollLeft: this.scrollPanelElm.scrollLeft
      };
    },
    onMouseWheel(event) /* istanbul ignore next */ {
      event.preventDefault();
      let delta = 0;
      let dir;
      if (event.wheelDelta) {
        if (event.deltaY) {
          dir = 'dy';
          delta = event.deltaY;
        } else {
          delta = event.deltaX;
          dir = 'dx';
        }
      } else if (event.detail) {
        // horizontal scroll
        if (event.axis == 1) {
          dir = 'dx';
        } else if (event.axis == 2) {
          // vertical scroll
          dir = 'dy';
        }
        delta = event.detail * 16;
      }

      this.scrollBy({ [dir]: delta }, 500);
    }
  },
  computed: {
    scrollContentElm() {
      return this.$refs['scrollContent']._isVue
        ? this.$refs['scrollContent'].$el
        : this.$refs['scrollContent'];
    }
  }
};
