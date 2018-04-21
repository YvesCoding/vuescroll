export default {
  methods: {
    updateNativeModeBarState() {
      const scrollPanel = this.scrollPanelElm;
      let heightPercentage = (scrollPanel.clientHeight * 100 / scrollPanel.scrollHeight);
      let widthPercentage = (scrollPanel.clientWidth * 100 / scrollPanel.scrollWidth);    
      this.vBar.state.posValue =  ((scrollPanel.scrollTop * 100) / scrollPanel.clientHeight);
      this.hBar.state.posValue =  ((scrollPanel.scrollLeft * 100) / scrollPanel.clientWidth); 
      this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + "%") : 0;
      this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + "%") : 0;
    }
  }
};