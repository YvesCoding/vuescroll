export default {
  methods: {
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    setBarClick(val) {
      /* istanbul ignore next */
      this.vuescroll.state.isClickingBar = val;
    }
  }
};
