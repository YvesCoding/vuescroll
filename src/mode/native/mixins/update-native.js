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
    recordNativeCurrentPos() {
      const state = this.vuescroll.state;
      let axis = {
        x: this.scrollPanelElm.scrollLeft,
        y: this.scrollPanelElm.scrollTop
      };
      const oldX = state.internalScrollLeft;
      const oldY = state.internalScrollTop;

      state.posX =
        oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;

      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
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
