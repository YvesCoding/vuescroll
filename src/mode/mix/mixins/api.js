import { goScrolling, getCurrentViewportDom } from 'mode/shared/util';
import { warn } from 'shared/util';

export default {
  methods: {
    // private api
    internalScrollTo(destX, destY, animate, force) {
      if (this.mode == 'native') {
        if (animate) {
          // hadnle for scroll complete
          const scrollingComplete = this.scrollingComplete.bind(this);

          goScrolling(
            this.$refs['scrollPanel'].$el,
            destX - this.$refs['scrollPanel'].$el.scrollLeft,
            destY - this.$refs['scrollPanel'].$el.scrollTop,
            this.mergedOptions.scrollPanel.speed,
            this.mergedOptions.scrollPanel.easing,
            scrollingComplete
          );
        } else {
          this.$refs['scrollPanel'].$el.scrollTop = destY;
          this.$refs['scrollPanel'].$el.scrollLeft = destX;
        }
      }
      // for non-native we use scroller's scorllTo
      else if (this.mode == 'slide') {
        this.scroller.scrollTo(destX, destY, animate, undefined, force);
      }
    },
    zoomBy(factor, animate, originLeft, originTop, callback) {
      if (this.mode != 'slide') {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomBy(factor, animate, originLeft, originTop, callback);
    },
    zoomTo(level, animate = false, originLeft, originTop, callback) {
      if (this.mode != 'slide') {
        warn('zoomBy and zoomTo are only for slide mode!');
        return;
      }
      this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
    },
    getCurrentPage() {
      if (this.mode != 'slide' || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      return this.scroller.getCurrentPage();
    },
    goToPage(dest, animate = false) {
      if (this.mode != 'slide' || !this.mergedOptions.vuescroll.paging) {
        warn(
          'getCurrentPage and goToPage are only for slide mode and paging is enble!'
        );
        return;
      }
      this.scroller.goToPage(dest, animate);
    },
    triggerRefreshOrLoad(type) {
      if (this.mode != 'slide') {
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
    getCurrentviewDom() {
      const parent =
        this.mode == 'slide' ? this.scrollPanelElm : this.scrollContentElm;

      const domFragment = getCurrentViewportDom(parent, this.$el);
      return domFragment;
    }
  }
};
