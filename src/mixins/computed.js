export default {
  computed: {
    scrollPanelElm() {
      return this.$refs['scrollPanel']._isVue
        ? this.$refs['scrollPanel'].$el
        : this.$refs['scrollPanel'];
    },
    scrollContentElm() {
      return this.$refs['scrollContent']._isVue
        ? this.$refs['scrollContent'].$el
        : this.$refs['scrollContent'];
    },
    mode() {
      return this.mergedOptions.vuescroll.mode;
    },
    pullRefreshTip() {
      return this.mergedOptions.vuescroll.pullRefresh.tips[
        this.vuescroll.state.refreshStage
      ];
    },
    pushLoadTip() {
      return this.mergedOptions.vuescroll.pushLoad.tips[
        this.vuescroll.state.loadStage
      ];
    },
    refreshLoad() {
      return (
        this.mergedOptions.vuescroll.pullRefresh.enable ||
        this.mergedOptions.vuescroll.pushLoad.enable
      );
    }
  }
};
