import { getCurrentViewportDom } from 'mode/shared/util';
import { warn, getNumericValue } from 'shared/util';

export default {
  methods: {
    slideScrollTo(x, y, speed, easing) {
      const { scrollLeft, scrollTop } = this.getPosition();

      x = getNumericValue(x || scrollLeft, this.scroller.__maxScrollLeft);
      y = getNumericValue(y || scrollTop, this.scroller.__maxScrollTop);

      this.scroller.scrollTo(x, y, speed > 0, undefined, false, speed, easing);
    },
    zoomBy(factor, animate, originLeft, originTop, callback) {
      if (!this.scroller) {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomBy(factor, animate, originLeft, originTop, callback);
    },
    zoomTo(level, animate = false, originLeft, originTop, callback) {
      if (!this.scroller) {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
    },
    getCurrentPage() {
      if (!this.scroller || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      return this.scroller.getCurrentPage();
    },
    goToPage(dest, animate = false) {
      if (!this.scroller || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      this.scroller.goToPage(dest, animate);
    },
    triggerRefreshOrLoad(type) {
      if (!this.scroller) {
        warn('You can only use triggerRefreshOrLoad in slide mode!');
        return;
      }

      const isRefresh = this.mergedOptions.vuescroll.pullRefresh.enable;
      const isLoad = this.mergedOptions.vuescroll.pushLoad.enable;

      if (type == 'refresh' && !isRefresh) {
        warn('refresh must be enabled!');
        return;
      } else if (type == 'load' && !isLoad) {
        warn('load must be enabled and content\'s height > container\'s height!');
        return;
      } else if (type !== 'refresh' && type !== 'load') {
        warn('param must be one of load and refresh!');
        return;
      }

      /* istanbul ignore if */
      if (this.vuescroll.state[`${type}Stage`] == 'start') {
        return;
      }

      this.scroller.triggerRefreshOrLoad(type);
      return true;
    },
    getCurrentviewDomSlide() {
      const parent = this.scrollPanelElm;
      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
