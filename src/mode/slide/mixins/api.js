import { getCurrentViewportDom } from 'mode/shared/util';
import { warn } from 'shared/util';

export default {
  methods: {
    // private api
    internalScrollTo(destX, destY, animate, force) {
      this.scroller.scrollTo(destX, destY, animate, undefined, force);
    },
    zoomBy(factor, animate, originLeft, originTop, callback) {
      this.scroller.zoomBy(factor, animate, originLeft, originTop, callback);
    },
    zoomTo(level, animate = false, originLeft, originTop, callback) {
      this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
    },
    getCurrentPage() {
      if (!this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only available when paging is enble!'
        );
        return;
      }
      return this.scroller.getCurrentPage();
    },
    goToPage(dest, animate = false) {
      if (!this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only available when paging is enble!'
        );
        return;
      }
      this.scroller.goToPage(dest, animate);
    },
    triggerRefreshOrLoad(type) {
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
    getCurrentviewDom() {
      const parent = this.scrollPanelElm;
      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
