/**
 * These mixes is exclusive for native mode
 */

import { getAccurateSize } from 'shared/util';

export default {
  methods: {
    updateNativeModeBarState() {
      const vuescroll = this.$el;
      const scrollPanel = this.scrollPanelElm;
      const isPercent = this.mergedOptions.vuescroll.sizeStrategy == 'percent';
      const accurateSize = getAccurateSize(vuescroll, true);
      const clientWidth = isPercent
        ? accurateSize.clientWidth
        : this.vuescroll.state.width.slice(0, -2); // xxxpx ==> xxx
      const clientHeight = isPercent
        ? accurateSize.clientHeight
        : this.vuescroll.state.height.slice(0, -2);

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
  },
  computed: {
    scrollContentElm() {
      return this.$refs['scrollContent']._isVue
        ? this.$refs['scrollContent'].$el
        : this.$refs['scrollContent'];
    }
  }
};
