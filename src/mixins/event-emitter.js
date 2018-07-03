export default {
  methods: {
    updateBarStateAndEmitEvent(eventType, nativeEvent = null) {
      if (this.mode == 'native' || this.mode == 'pure-native') {
        this.updateNativeModeBarState();
      } else if (this.mode == 'slide') {
        if (!this.scroller) {
          return;
        }
        this.updateSlideModeBarState();
      }
      if (eventType) {
        this.emitEvent(eventType, nativeEvent);
      }
      if (this.mergedOptions.bar.onlyShowBarOnScroll) {
        if (
          eventType == 'handle-scroll' ||
          eventType == 'handle-resize' ||
          eventType == 'refresh-status' ||
          eventType == 'window-resize' ||
          eventType == 'options-change'
        ) {
          this.showAndDefferedHideBar(true);
        }
      } else {
        this.showAndDefferedHideBar();
      }
    },
    /**
     *  emit user registry event
     */
    emitEvent(eventType, nativeEvent = null) {
      let {
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        scrollTop,
        scrollLeft
      } = this.scrollPanelElm;
      const vertical = {
        type: 'vertical'
      };
      const horizontal = {
        type: 'horizontal'
      };
      if (this.mode == 'slide') {
        scrollHeight = this.scroller.__contentHeight;
        scrollWidth = this.scroller.__contentWidth;
        scrollTop = this.scroller.__scrollTop;
        scrollLeft = this.scroller.__scrollLeft;
        clientHeight = this.$el.clientHeight;
        clientWidth = this.$el.clientWidth;
      }
      vertical['process'] = Math.min(
        scrollTop / (scrollHeight - clientHeight),
        1
      );
      horizontal['process'] = Math.min(
        scrollLeft / (scrollWidth - clientWidth),
        1
      );
      vertical['barSize'] = this.bar.vBar.state.size;
      horizontal['barSize'] = this.bar.hBar.state.size;
      vertical['scrollTop'] = scrollTop;
      horizontal['scrollLeft'] = scrollLeft;
      vertical['directionY'] = this.vuescroll.state.posY;
      horizontal['directionX'] = this.vuescroll.state.posX;
      this.$emit(eventType, vertical, horizontal, nativeEvent);
    }
  }
};
