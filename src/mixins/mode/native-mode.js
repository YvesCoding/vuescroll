export default {
  methods: {
    updateNativeModeBarState() {
      const scrollPanel = this.scrollPanelElm;
      const vuescroll = this.$el;
      let heightPercentage =
        vuescroll.clientHeight * 100 / scrollPanel.scrollHeight;
      let widthPercentage =
        vuescroll.clientWidth * 100 / scrollPanel.scrollWidth;
      this.bar.vBar.state.posValue =
        scrollPanel.scrollTop * 100 / vuescroll.clientHeight;
      this.bar.hBar.state.posValue =
        scrollPanel.scrollLeft * 100 / vuescroll.clientWidth;
      this.bar.vBar.state.size =
        heightPercentage < 100 ? heightPercentage + '%' : 0;
      this.bar.hBar.state.size =
        widthPercentage < 100 ? widthPercentage + '%' : 0;
    }
  }
};
