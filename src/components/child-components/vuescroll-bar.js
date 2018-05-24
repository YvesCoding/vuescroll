import scrollMap from '../../shared/scroll-map';
import { eventCenter } from '../../util';

/* istanbul ignore next */
function handleClickTrack(
  e,
  { client, offset, posName, scrollSize },
  parentRef,
  type,
  parent
) {
  const inner = parentRef[`${type}Bar`].$refs['inner'];
  const barOffset = inner[offset];
  const percent =
    (e[client] - e.target.getBoundingClientRect()[posName] - barOffset / 2) /
    e.target[offset];
  const pos = parentRef['scrollPanel'].$el[scrollSize] * percent;
  parent.scrollTo({ [scrollMap[type].axis.toLowerCase()]: pos });
}

const colorCache = {};

const rgbReg = /rgb\(/;
const extractRgbColor = /rgb\((.*)\)/;

function getRgbAColor(color, opacity) {
  let cachedColor = null;
  if ((cachedColor = colorCache[color + '&' + opacity])) {
    return cachedColor;
  }
  const div = document.createElement('div');
  div.style.background = color;
  document.body.appendChild(div);
  const computedColor = window.getComputedStyle(div).backgroundColor;
  document.body.removeChild(div);
  /* istanbul ignore if */
  if (!rgbReg.test(computedColor)) {
    return color;
  }
  return (colorCache[color + '&' + opacity] = cachedColor = `rgba(${
    extractRgbColor.exec(computedColor)[1]
  }, ${opacity})`);
}

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
      /* istanbul ignore next */
      return scrollMap[this.type].axis;
    },
    parent() {
      /* istanbul ignore next */
      return this.$parent.$refs;
    }
  },
  render(h) {
    const railBackgroundColor = getRgbAColor(
      this.ops.rail.background,
      this.ops.rail.opacity
    );
    let style = {
      [this.bar.posName]: 0,
      [this.bar.opsSize]: '100%',
      [this.bar.size]: this.state.size,
      borderRadius: this.ops.rail[this.bar.opsSize],
      background: this.ops.bar.background,
      opacity: this.state.opacity,
      transform: `translate${scrollMap[this.type].axis}(${
        this.state.posValue
      }%)`,
      cursor: 'pointer',
      position: 'relative',
      transition: 'opacity .5s',
      userSelect: 'none'
    };
    const bar = {
      style: style,
      class: `vuescroll-${this.type}-bar`,
      on: {
        mousedown: this.handleMousedown
      },
      ref: 'inner'
    };
    /* istanbul ignore if */
    if (this.ops.bar.hover) {
      bar.on['mouseenter'] = () => {
        this.$el.style.background = this.ops.hover;
      };
      bar.on['mouseleave'] = () => {
        this.$el.style.background = this.ops.background;
      };
    }

    const vm = this;
    const parentRef = vm.$parent.$refs;

    const rail = {
      class: `vuescroll-${this.type}-rail`,
      style: {
        position: 'absolute',
        borderRadius: this.ops.rail[this.bar.opsSize],
        background: railBackgroundColor,
        [this.bar.opsSize]: this.ops.rail[this.bar.opsSize],
        [this.bar.posName]: '2px',
        [this.bar.opposName]: '2px',
        [this.ops.rail.pos]: 0
      },
      on: {
        click(e) /* istanbul ignore next */ {
          handleClickTrack(e, vm.bar, parentRef, vm.type, vm.$parent);
        }
      }
    };
    return (
      <div {...rail}>
        <div {...bar} />
      </div>
    );
  },
  methods: {
    handleMousedown(e) {
      /* istanbul ignore next */
      {
        e.stopImmediatePropagation();
        document.onselectstart = () => false;
        this.axisStartPos =
          e[this.bar.client] -
          this.$refs['inner'].getBoundingClientRect()[this.bar.posName];
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
          this.$el.getBoundingClientRect()[this.bar.posName];
        const percent = (delta - this.axisStartPos) / this.$el[this.bar.offset];
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
  const axis = type === 'vertical' ? 'Y' : 'X';
  const barType = `${type.charAt(0)}Bar`;
  const railType = `${type.charAt(0)}Rail`;

  if (
    !vm.bar[barType].state.size ||
    !vm.mergedOptions.scrollPanel['scrolling' + axis] ||
    vm.mode == 'pure-native' ||
    (vm.refreshLoad && type !== 'vertical' && vm.mode === 'slide')
  ) {
    return null;
  }

  const barData = {
    props: {
      type: type,
      ops: {
        bar: vm.mergedOptions.bar[barType],
        rail: vm.mergedOptions.rail[railType]
      },
      state: vm.bar[barType].state
    },
    on: {
      setBarClick: vm.setBarClick
    },
    ref: `${type}Bar`
  };

  return <bar {...barData} />;
}
