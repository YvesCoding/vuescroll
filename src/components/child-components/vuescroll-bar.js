import scrollMap from '../../shared/scroll-map';
import { eventCenter, isSupportTouch, getRealParent } from '../../util';

const colorCache = {};
const rgbReg = /rgb\(/;
const extractRgbColor = /rgb\((.*)\)/;

/* istanbul ignore next */
function createMouseEvent(ctx) {
  const parent = getRealParent(ctx);

  function mousedown(e) {
    e.stopImmediatePropagation();
    document.onselectstart = () => false;
    ctx.axisStartPos =
      e[ctx.bar.client] -
      ctx.$refs['inner'].getBoundingClientRect()[ctx.bar.posName];
    // tell parent that the mouse has been down.
    ctx.$emit('setBarClick', true);
    eventCenter(document, 'mousemove', mousemove);
    eventCenter(document, 'mouseup', mouseup);
  }
  function mousemove(e) {
    if (!ctx.axisStartPos) {
      return;
    }
    const delta =
      e[ctx.bar.client] - ctx.$el.getBoundingClientRect()[ctx.bar.posName];
    const percent = (delta - ctx.axisStartPos) / ctx.$el[ctx.bar.offset];
    parent.scrollTo(
      {
        [ctx.bar.axis.toLowerCase()]:
          parent.$refs['scrollPanel'].$el[ctx.bar.scrollSize] * percent
      },
      false
    );
  }
  function mouseup() {
    ctx.$emit('setBarClick', false);
    document.onselectstart = null;
    parent.hideBar();
    ctx.axisStartPos = 0;
    eventCenter(document, 'mousemove', mousemove, false, 'off');
    eventCenter(document, 'mouseup', mouseup, false, 'off');
  }

  return mousedown;
}

/* istanbul ignore next */
function createTouchEvent(ctx) {
  function touchstart(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    document.onselectstart = () => false;

    ctx.axisStartPos =
      e.touches[0][ctx.bar.client] -
      ctx.$refs['inner'].getBoundingClientRect()[ctx.bar.posName];

    // tell parent that the mouse has been down.
    ctx.$emit('setBarClick', true);
    eventCenter(document, 'touchmove', touchmove);
    eventCenter(document, 'touchend', touchend);
  }
  function touchmove(e) {
    if (!ctx.axisStartPos) {
      return;
    }
    const delta =
      e.touches[0][ctx.bar.client] -
      ctx.$el.getBoundingClientRect()[ctx.bar.posName];
    const percent = (delta - ctx.axisStartPos) / ctx.$el[ctx.bar.offset];
    parent.scrollTo(
      {
        [ctx.bar.axis.toLowerCase()]:
          parent.$refs['scrollPanel'].$el[ctx.bar.scrollSize] * percent
      },
      false
    );
  }
  function touchend() {
    ctx.$emit('setBarClick', false);
    document.onselectstart = null;
    ctx.$parent.hideBar();
    ctx.axisStartPos = 0;
    eventCenter(document, 'touchmove', touchmove, false, 'off');
    eventCenter(document, 'touchend', touchend, false, 'off');
  }
  return touchstart;
}

// Transform a common color int oa `rgbA` color
function getRgbAColor(color, opacity) {
  const id = color + '&' + opacity;
  if (colorCache[id]) {
    return colorCache[id];
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

  return (colorCache[id] = `rgba(${
    extractRgbColor.exec(computedColor)[1]
  }, ${opacity})`);
}

/* istanbul ignore next */
function handleClickTrack(e) {
  const ctx = this;
  const parent = getRealParent(this);
  const { client, offset, posName, axis } = ctx.bar;
  const inner = ctx.$refs['inner'];
  const barOffset = inner[offset];
  const percent =
    (e[client] -
      e.currentTarget.getBoundingClientRect()[posName] -
      barOffset / 2) /
    e.currentTarget[offset];

  parent.scrollTo({
    [axis.toLowerCase()]: percent * 100 + '%'
  });
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
      return scrollMap[this.type];
    }
  },
  render(h) {
    const vm = this;
    const railBackgroundColor = getRgbAColor(
      vm.ops.rail.background,
      vm.ops.rail.opacity
    );
    let style = {
      [vm.bar.size]: vm.state.size,
      background: vm.ops.bar.background,
      opacity: vm.state.opacity,
      transform: `translate${scrollMap[vm.type].axis}(${vm.state.posValue}%)`
    };
    const bar = {
      style: style,
      class: `__bar-is-${vm.type}`,
      ref: 'inner',
      on: {}
    };

    /* istanbul ignore if */
    if (vm.ops.bar.hover) {
      bar.on['mouseenter'] = () => {
        vm.$el.style.background = vm.ops.hover;
      };
      bar.on['mouseleave'] = () => {
        vm.$el.style.background = vm.ops.background;
      };
    }
    /* istanbul ignore if */
    if (isSupportTouch()) {
      bar.on['touchstart'] = createTouchEvent(this);
    } else {
      bar.on['mousedown'] = createMouseEvent(this);
    }

    const rail = {
      class: `__rail-is-${vm.type}`,
      style: {
        borderRadius: vm.ops.rail[vm.bar.opsSize],
        background: railBackgroundColor,
        [vm.bar.opsSize]: vm.ops.rail[vm.bar.opsSize],
        [vm.ops.rail.pos]: '2px'
      },
      on: {
        click(e) /* istanbul ignore next */ {
          handleClickTrack.call(vm, e);
        }
      }
    };

    return (
      <div {...rail}>
        <div {...bar} />
      </div>
    );
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
