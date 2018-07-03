function findValuesByMode(mode, vm) {
  let axis = {};
  switch (mode) {
  case 'native':
  case 'pure-native':
    axis = {
      x: vm.scrollPanelElm.scrollLeft,
      y: vm.scrollPanelElm.scrollTop
    };
    break;
  case 'slide':
    axis = { x: vm.scroller.__scrollLeft, y: vm.scroller.__scrollTop };
    break;
  }
  return axis;
}

export default {
  methods: {
    isEnableLoad() {
      // Enable load only when clientHeight <= scrollHeight
      if (!this._isMounted) return false;
      const panelElm = this.scrollPanelElm;
      const containerElm = this.$el;

      /* istanbul ignore if */
      if (!this.mergedOptions.vuescroll.pushLoad.enable) {
        return false;
      }
      let loadDom = null;
      if (this.$refs['loadDom']) {
        loadDom = this.$refs['loadDom'].elm || this.$refs['loadDom'];
      }
      const loadHeight = (loadDom && loadDom.offsetHeight) || 0;
      /* istanbul ignore if */
      if (panelElm.scrollHeight - loadHeight <= containerElm.clientHeight) {
        return false;
      }
      return true;
    },
    showAndDefferedHideBar(forceHideBar) {
      this.showBar();
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
      this.timeoutId = setTimeout(() => {
        this.timeoutId = 0;
        this.hideBar(forceHideBar);
      }, this.mergedOptions.bar.showDelay);
    },
    showBar() {
      this.bar.vBar.state.opacity = this.mergedOptions.bar.vBar.opacity;
      this.bar.hBar.state.opacity = this.mergedOptions.bar.hBar.opacity;
    },
    hideBar(forceHideBar) {
      // when in non-native mode dragging content
      // in slide mode, just return
      /* istanbul ignore next */
      if (this.vuescroll.state.isDragging) {
        return;
      }

      if (forceHideBar && !this.mergedOptions.bar.hBar.keepShow) {
        this.bar.hBar.state.opacity = 0;
      }
      if (forceHideBar && !this.mergedOptions.bar.vBar.keepShow) {
        this.bar.vBar.state.opacity = 0;
      }
      // add isClickingBar condition
      // to prevent from hiding bar while dragging the bar
      if (
        !this.mergedOptions.bar.vBar.keepShow &&
        !this.vuescroll.state.isClickingBar &&
        this.vuescroll.state.pointerLeave
      ) {
        this.bar.vBar.state.opacity = 0;
      }
      if (
        !this.mergedOptions.bar.hBar.keepShow &&
        !this.vuescroll.state.isClickingBar &&
        this.vuescroll.state.pointerLeave
      ) {
        this.bar.hBar.state.opacity = 0;
      }
    },
    recordCurrentPos() {
      let mode = this.mode;
      if (this.mode !== this.lastMode) {
        mode = this.lastMode;
        this.lastMode = this.mode;
      }
      const state = this.vuescroll.state;
      let axis = findValuesByMode(mode, this);
      const oldX = state.internalScrollLeft;
      const oldY = state.internalScrollTop;
      state.posX =
        oldX - axis.x > 0 ? 'right' : oldX - axis.x < 0 ? 'left' : null;
      state.posY = oldY - axis.y > 0 ? 'up' : oldY - axis.y < 0 ? 'down' : null;
      state.internalScrollLeft = axis.x;
      state.internalScrollTop = axis.y;
    },
    useNumbericSize() {
      const parentElm = this.$el.parentNode;
      const { position } = parentElm.style;
      if (!position || position == 'static') {
        this.$el.parentNode.style.position = 'relative';
      }
      this.vuescroll.state.height = parentElm.offsetHeight + 'px';
      this.vuescroll.state.width = parentElm.offsetWidth + 'px';
    },
    usePercentSize() {
      this.vuescroll.state.height = '100%';
      this.vuescroll.state.width = '100%';
    },
    // set its size to be equal to its parentNode
    setVsSize() {
      if (this.mergedOptions.vuescroll.sizeStrategy == 'number') {
        this.useNumbericSize();
        this.registryParentResize();
      } else if (this.mergedOptions.vuescroll.sizeStrategy == 'percent') {
        if (this.destroyParentDomResize) {
          this.destroyParentDomResize();
          this.destroyParentDomResize = null;
        }
        this.usePercentSize();
      }
    }
  }
};
