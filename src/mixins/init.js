import { smallChangeArray } from '../shared/constants';
import { isChildInParent } from '../util';

export default {
  methods: {
    initWatchOpsChange() {
      const watchOpts = {
        deep: true,
        sync: true
      };
      this.$watch(
        'mergedOptions',
        () => {
          // record current position
          this.recordCurrentPos();
          setTimeout(() => {
            if (this.isSmallChangeThisTick == true) {
              this.isSmallChangeThisTick = false;
              this.updateBarStateAndEmitEvent('options-change');
              return;
            }
            this.refreshInternalStatus();
          }, 0);
        },
        watchOpts
      );

      smallChangeArray.forEach(opts => {
        this.$watch(
          opts,
          () => {
            // when small changes changed,
            // we need not to updateMode or registryResize
            this.isSmallChangeThisTick = true;
          },
          watchOpts
        );
      });
    },
    // scrollTo hash-anchor while mounted
    scrollToAnchor() /* istanbul ignore next */ {
      const validateHashSelector = function(hash) {
        return /^#[a-zA-Z_]\d*$/.test(hash);
      };
      let hash = window.location.hash;
      if (
        !hash ||
        ((hash = hash.slice(hash.lastIndexOf('#'))) &&
          !validateHashSelector(hash))
      ) {
        return;
      }
      const elm = document.querySelector(hash);
      if (
        !isChildInParent(elm, this.$el) ||
        this.mergedOptions.scrollPanel.initialScrollY ||
        this.mergedOptions.scrollPanel.initialScrollX
      ) {
        return;
      }
      this.scrollIntoView(elm);
    },
    initVariables() {
      this.lastMode = this.mode;
      this.$el._isVuescroll = true;
      this.clearScrollingTimes();
    }
  }
};
