import { extractNumberFromPx } from 'shared/util';

export default {
  methods: {
    updateNativeModeBarState() {
      const scrollPanel = this.scrollPanelElm;
      const vuescroll = this.$el;
      const isPercent = this.mergedOptions.vuescroll.sizeStrategy == 'percent';

      const clientWidth = isPercent
        ? vuescroll.clientWidth
        : extractNumberFromPx(this.vuescroll.state.width);
      const clientHeight = isPercent
        ? vuescroll.clientHeight
        : extractNumberFromPx(this.vuescroll.state.height);

      let heightPercentage = (clientHeight * 100) / scrollPanel.scrollHeight;
      let widthPercentage = (clientWidth * 100) / scrollPanel.scrollWidth;

      this.bar.vBar.state.posValue =
        (scrollPanel.scrollTop * 100) / clientHeight;
      this.bar.hBar.state.posValue =
        (scrollPanel.scrollLeft * 100) / clientWidth;

      this.bar.vBar.state.size =
        heightPercentage < 100 ? heightPercentage + '%' : 0;
      this.bar.hBar.state.size =
        widthPercentage < 100 ? widthPercentage + '%' : 0;
    }
  }
};
