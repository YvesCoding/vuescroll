export default {
  methods: {
    updateMode() {
      const x = this.vuescroll.state.internalScrollLeft;
      const y = this.vuescroll.state.internalScrollTop;
      if (this.destroyScroller) {
        this.scroller.stop();
        this.destroyScroller();
        this.destroyScroller = null;
      }
      if (this.mode == 'slide') {
        this.destroyScroller = this.registryScroller();
      } else if (this.mode == 'native' || this.mode == 'pure-native') {
        // remove the legacy transform style attribute
        this.scrollPanelElm.style.transform = '';
        this.scrollPanelElm.style.transformOrigin = '';
      }
      // keep the last-mode's position.
      this.scrollTo({ x, y }, false, true /* force */);
    },
    refreshInternalStatus() {
      // 1.set vuescroll height or width according to
      // sizeStrategy
      this.setVsSize();
      // 2. registry resize event
      this.registryResize();
      // 3. registry scroller if mode is 'slide'
      // or remove 'transform origin' is the mode is not `slide`
      this.updateMode();
      // 4. update scrollbar's height/width
      this.updateBarStateAndEmitEvent('refresh-status');
    }
  }
};
