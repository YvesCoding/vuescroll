import scrollMap from 'shared/scroll-map';
import {
  eventCenter,
  isSupportTouch,
  getRealParent,
  mergeObject
} from 'shared/util';

const colorCache = {};
const rgbReg = /rgb\(/;
const extractRgbColor = /rgb\((.*)\)/;

/* istanbul ignore next */
function createMouseEvent(ctx) {
  const parent = getRealParent(ctx);

  function mousedown(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    document.onselectstart = () => false;
    ctx.axisStartPos =
      e[ctx.bar.client] -
      ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName];

    // Tell parent that the mouse has been down.
    ctx.setBarDrag(true);
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
          parent.scrollPanelElm[ctx.bar.scrollSize] * percent
      },
      false
    );
  }

  function mouseup() {
    ctx.setBarDrag(false);
    parent.hideBar();

    document.onselectstart = null;
    ctx.axisStartPos = 0;

    eventCenter(document, 'mousemove', mousemove, false, 'off');
    eventCenter(document, 'mouseup', mouseup, false, 'off');
  }

  return mousedown;
}

/* istanbul ignore next */
function createTouchEvent(ctx) {
  const parent = getRealParent(ctx);

  function touchstart(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    document.onselectstart = () => false;

    ctx.axisStartPos =
      e.touches[0][ctx.bar.client] -
      ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName];

    // Tell parent that the mouse has been down.
    ctx.setBarDrag(true);
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
          parent.scrollPanelElm[ctx.bar.scrollSize] * percent
      },
      false
    );
  }
  function touchend() {
    ctx.setBarDrag(false);
    parent.hideBar();

    document.onselectstart = null;
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

function createTrackEvent(ctx, type) {
  return function handleClickTrack(e) {
    const parent = getRealParent(ctx);

    const { client, offset, posName, axis } = ctx.bar;
    const thumb = ctx.$refs['thumb'];

    e.preventDefault();
    e.stopImmediatePropagation();

    /* istanbul ignore if */
    if (!thumb) return;

    const barOffset = thumb[offset];
    const event = type == 'touchstart' ? e.touches[0] : e;

    const percent =
      (event[client] -
        e.currentTarget.getBoundingClientRect()[posName] -
        barOffset / 2) /
      (e.currentTarget[offset] - barOffset);

    parent.scrollTo({
      [axis.toLowerCase()]: percent * 100 + '%'
    });
  };
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
    hideBar: {
      type: Boolean
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

    /** Scrollbar style */
    let style = {
      [vm.bar.size]: vm.state.size,
      background: vm.ops.bar.background,
      opacity: vm.state.opacity,
      transform: `translate${scrollMap[vm.type].axis}(${vm.state.posValue}%)`
    };
    const bar = {
      style: style,
      class: `__bar-is-${vm.type}`,
      ref: 'thumb',
      on: {
        mouseenter() {
          vm.setBarHoverStyles();
        },
        mouseleave() {
          vm.tryRestoreBarStyles();
        }
      }
    };

    /** Get rgbA format background color */
    const railBackgroundColor = getRgbAColor(
      vm.ops.rail.background,
      vm.ops.rail.opacity
    );

    /** Rail Data */
    const rail = {
      class: `__rail-is-${vm.type}`,
      style: {
        borderRadius: vm.ops.rail.specifyBorderRadius || vm.ops.rail.size,
        background: railBackgroundColor,
        [vm.bar.opsSize]: vm.ops.rail.size,
        [vm.bar.posName]: vm.ops.rail['gutterOfEnds'],
        [vm.bar.opposName]: vm.ops.rail['gutterOfEnds'],
        [vm.bar.sidePosName]: vm.ops.rail['gutterOfSide']
      },
      on: {}
    };

    /* istanbul ignore if */
    if (isSupportTouch()) {
      bar.on['touchstart'] = createTouchEvent(this);
      rail.on['touchstart'] = createTrackEvent(this, 'touchstart');
    } else {
      bar.on['mousedown'] = createMouseEvent(this);
      rail.on['mousedown'] = createTrackEvent(this, 'mousedown');
    }

    return <div {...rail}>{this.hideBar ? null : <div {...bar} />}</div>;
  },
  data() {
    return {
      // Use to restore bar styles after hovering the bars, on enable
      // when option hoverStyle is not `falsy`.
      originBarStyle: null,
      isBarDragging: false
    };
  },
  methods: {
    setBarDrag(val) /* istanbul ignore next */ {
      this.$emit('setBarDrag', (this.isBarDragging = val));

      if (!val) {
        this.tryRestoreBarStyles();
      }
    },
    tryRestoreBarStyles() {
      /* istanbul ignore if */
      if (this.isBarDragging) return;

      Object.keys(this.originBarStyle).forEach(key => {
        this.$refs.thumb.style[key] = this.originBarStyle[key];
      });
    },
    setBarHoverStyles() {
      let hoverBarStyle = this.ops.bar.hoverStyle;
      /* istanbul ignore next */
      if (!hoverBarStyle) return;

      if (!this.originBarStyle) {
        this.originBarStyle = {};
        Object.keys(hoverBarStyle).forEach(key => {
          this.originBarStyle[key] = this.$refs.thumb.style[key];
        });
      }

      mergeObject(hoverBarStyle, this.$refs.thumb.style, true);
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
  const axis = scrollMap[type].axis;
  /** type.charAt(0) = vBar/hBar */
  const barType = `${type.charAt(0)}Bar`;

  const hideBar =
    !vm.bar[barType].state.size ||
    !vm.mergedOptions.scrollPanel['scrolling' + axis] ||
    (vm.refreshLoad && type !== 'vertical');

  const keepShowRail = vm.mergedOptions.rail.keepShow;

  if (hideBar && !keepShowRail) {
    return null;
  }

  const barData = {
    props: {
      type: type,
      ops: {
        bar: vm.mergedOptions.bar,
        rail: vm.mergedOptions.rail
      },
      state: vm.bar[barType].state,
      hideBar
    },
    on: {
      setBarDrag: vm.setBarDrag
    },
    ref: `${type}Bar`
  };

  return <bar {...barData} />;
}
