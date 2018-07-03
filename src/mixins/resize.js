import { listenResize } from '../third-party/resize-detector';

export default {
  methods: {
    registryResize() {
      /* istanbul ignore next */
      if (this.destroyResize) {
        // when toggling the mode
        // we should clean the flag-object.
        this.destroyResize();
      }
      let contentElm = null;
      if (this.mode == 'slide' || this.mode == 'pure-native') {
        contentElm = this.scrollPanelElm;
      } else if (this.mode == 'native') {
        // scrollContent maybe a component or a pure-dom
        contentElm = this.scrollContentElm;
      }
      const handleWindowResize = function() /* istanbul ignore next */ {
        this.updateBarStateAndEmitEvent('window-resize');
        if (this.mode == 'slide') {
          this.vuescroll.updatedCbs.push(this.updateScroller);
          this.$forceUpdate();
        }
      };
      const handleDomResize = () => {
        let currentSize = {};
        if (this.mode == 'slide') {
          currentSize['width'] = this.scroller.__contentWidth;
          currentSize['height'] = this.scroller.__contentHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
          // update scroller should after rendering
          this.vuescroll.updatedCbs.push(this.updateScroller);
          this.$forceUpdate();
        } else if (this.mode == 'native' || this.mode == 'pure-native') {
          currentSize['width'] = this.scrollPanelElm.scrollWidth;
          currentSize['height'] = this.scrollPanelElm.scrollHeight;
          this.updateBarStateAndEmitEvent('handle-resize', currentSize);
        }
      };
      window.addEventListener('resize', handleWindowResize.bind(this), false);
      const destroyDomResize = listenResize(contentElm, handleDomResize);
      const destroyWindowResize = () => {
        window.removeEventListener('resize', handleWindowResize, false);
      };

      this.destroyResize = () => {
        destroyWindowResize();
        destroyDomResize();
      };
    },
    registryParentResize() {
      this.destroyParentDomResize = listenResize(
        this.$el.parentNode,
        this.useNumbericSize
      );
    }
  }
};
