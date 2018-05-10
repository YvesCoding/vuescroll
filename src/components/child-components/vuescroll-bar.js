import scrollMap from '../../shared/scroll-map';
import { eventCenter } from '../../util';
import { render } from '../../third-party/scroller/render';
export default {
  name: 'bar',
  props: {
    ops: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    bar() {
      return scrollMap[this.type].bar;
    },
    axis() {
      return scrollMap[this.type].axis;
    },
    parent() {
      return this.$parent.$refs;
    }
  },
  render(h) {
    // eslint-disable-line
    let style = {
      [this.bar.posName]: 0,
      [this.ops.pos]: 0,
      [this.bar.size]: this.state.size,
      [this.bar.opsSize]: this.ops[this.bar.opsSize],
      borderRadius: this.ops[this.bar.opsSize],
      background: this.ops.background,
      opacity: this.state.opacity,
      cursor: 'pointer',
      position: 'absolute',
      transition: 'opacity .5s',
      userSelect: 'none',
      ...render(this.type, window, '%', this.state.posValue)
    };
    const data = {
      style: style,
      class: `vuescroll-${this.type}-scrollbar`,
      on: {
        mousedown: this.handleMousedown
      }
    };
    if (this.ops.hover) {
      data.on['mouseenter'] = () => {
        this.$el.style.background = this.ops.hover;
      };
      data.on['mouseleave'] = () => {
        this.$el.style.background = this.ops.background;
      };
    }
    return <div {...data} />;
  },
  methods: {
    handleMousedown(e) {
      /* istanbul ignore next */
      {
        e.stopPropagation();
        document.onselectstart = () => false;
        this.axisStartPos =
          e[this.bar.client] - this.$el.getBoundingClientRect()[this.bar.posName];
        // tell parent that the mouse has been down.
        this.$emit('setBarClick', true);
        eventCenter(document, 'mousemove', this.handleMouseMove);
        eventCenter(document, 'mouseup', this.handleMouseUp);
      }
    },
    handleMouseMove(e) {
      /* istanbul ignore next */
      if (!this.axisStartPos) {
        return;
      }
      /* istanbul ignore next */
      {
        // https://github.com/ElemeFE/element/blob/27a8c1556e30ae38423ebc4bb100486e59b8601f/packages/scrollbar/src/bar.js#L72
        const delta =
          e[this.bar.client] -
          this.parent[`${this.type}Rail`].getBoundingClientRect()[
            this.bar.posName
          ];
        const percent =
          (delta - this.axisStartPos) /
          this.parent[`${this.type}Rail`][this.bar.offset];
        this.$parent.scrollTo(
          {
            [this.axis.toLowerCase()]:
              this.parent['scrollPanel'].$el[this.bar.scrollSize] * percent
          },
          false
        );
      }
    },
    handleMouseUp() {
      /* istanbul ignore next */
      {
        this.$emit('setBarClick', false);
        document.onselectstart = null;
        this.$parent.hideBar();
        this.axisStartPos = 0;
        eventCenter(document, 'mousemove', this.handleMouseMove, 'off');
        eventCenter(document, 'mouseup', this.handleMouseUp, 'off');
      }
    }
  }
};

/**
 * create bars
 *
 * @param {any} size
 * @param {any} type
 */
export function createBar(h, vm, type) {
  // hBar data
  const barType = type === 'vertical' ? 'vBar' : 'hBar';
  const axis = type === 'vertical' ? 'Y' : 'X';

  const barData = {
    props: {
      type: type,
      ops: vm.mergedOptions.bar[barType],
      state: vm.bar[barType].state
    },
    on: {
      setBarClick: vm.setBarClick
    },
    ref: `${type}Bar`
  };
  if (
    !vm.bar[barType].state.size ||
    !vm.mergedOptions.scrollPanel['scrolling' + axis] ||
    vm.mode == 'pure-native' ||
    (vm.refreshLoad && type !== 'vertical' && vm.mode === 'slide')
  ) {
    return null;
  }
  return <bar {...barData} />;
}
