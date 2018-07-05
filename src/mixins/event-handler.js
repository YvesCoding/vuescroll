export default {
  methods: {
    handleScroll(nativeEvent) {
      this.recordCurrentPos();
      this.updateBarStateAndEmitEvent('handle-scroll', nativeEvent);
    },
    scrollingComplete() {
      this.vuescroll.state.scrollingTimes++;
      this.updateBarStateAndEmitEvent('handle-scroll-complete');
    },
    setBarClick(val) {
      /* istanbul ignore next */
      this.vuescroll.state.isClickingBar = val;
    }
  }
};
