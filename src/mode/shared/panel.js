// begin importing
import { insertChildrenIntoSlot, getRealParent } from 'shared/util';

export default {
  name: 'scrollPanel',
  props: { ops: { type: Object, required: true } },
  methods: {
    // trigger scrollPanel options initialScrollX,
    // initialScrollY
    updateInitialScroll() {
      let x = 0;
      let y = 0;

      const parent = getRealParent(this);

      if (this.ops.initialScrollX) {
        x = this.ops.initialScrollX;
      }
      if (this.ops.initialScrollY) {
        y = this.ops.initialScrollY;
      }
      if (x || y) {
        parent.scrollTo({ x, y });
      }
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this._isDestroyed) {
        this.updateInitialScroll();
      }
    }, 0);
  },
  render(h) {
    // eslint-disable-line
    let data = {
      class: ['__panel'],
      style: {
        position: 'relative',
        boxSizing: 'border-box'
      }
    };

    const parent = getRealParent(this);

    const _customPanel = parent.$slots['scroll-panel'];
    if (_customPanel) {
      return insertChildrenIntoSlot(h, _customPanel, this.$slots.default, data);
    }

    return <div {...data}>{[this.$slots.default]}</div>;
  }
};
