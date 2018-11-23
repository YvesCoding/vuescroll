import scrollMap from 'shared/scroll-map';
import {
  eventCenter,
  isSupportTouch,
  getRealParent,
  mergeObject
} from 'shared/util';

import { requestAnimationFrame } from 'core/third-party/scroller/requestAnimationFrame';

const colorCache = {};
const rgbReg = /rgb\(/;
const extractRgbColor = /rgb\((.*)\)/;

/* istanbul ignore next */
function createBarEvent(ctx, type = 'mouse') {
  const parent = getRealParent(ctx);
  const moveEventName = type == 'mouse' ? 'mousemove' : 'touchmove';
  const endEventName = type == 'mouse' ? 'mouseup' : 'touchend';

  function mousedown(e) {
    e.stopImmediatePropagation();
    e.preventDefault();

    const event = type == 'mouse' ? e : e.touches[0];

    document.onselectstart = () => false;
    ctx.axisStartPos =
      event[ctx.bar.client] -
      ctx.$refs['thumb'].getBoundingClientRect()[ctx.bar.posName];

    // Tell parent that the mouse has been down.
    ctx.setBarDrag(true);
    eventCenter(document, moveEventName, mousemove);
    eventCenter(document, endEventName, mouseup);
  }

  function mousemove(e) {
    if (!ctx.axisStartPos) {
      return;
    }

    const thubmParent = ctx.$refs.thumb.parentNode;

    const event = type == 'mouse' ? e : e.touches[0];

    const delta =
      event[ctx.bar.client] -
      thubmParent.getBoundingClientRect()[ctx.bar.posName];
    const percent = (delta - ctx.axisStartPos) / thubmParent[ctx.bar.offset];
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

    eventCenter(document, moveEventName, mousemove, false, 'off');
    eventCenter(document, endEventName, mouseup, false, 'off');
  }

  return mousedown;
}

/* istanbul ignore next */
function createScrollButtonEvent(ctx, type, env = 'mouse') {
  const parent = getRealParent(ctx);
  const endEventName = env == 'mouse' ? 'mouseup' : 'touchend';
  const { step, mousedownStep } = ctx.ops.scrollButton;
  const stepWithDirection = type == 'start' ? -step : step;
  const mousedownStepWithDirection =
    type == 'start' ? -mousedownStep : mousedownStep;
  const ref = requestAnimationFrame(window);

  let isMouseDown = false;
  let isMouseout = true;
  let timeoutId;

  function start(e) {
    /* istanbul ignore if */

    if (3 == e.which) {
      return;
    }

    e.stopImmediatePropagation();
    e.preventDefault();

    isMouseout = false;

    parent.scrollBy({
      ['d' + ctx.bar.axis.toLowerCase()]: stepWithDirection
    });

    eventCenter(document, endEventName, endPress, false);

    if (env == 'mouse') {
      const elm = ctx.$refs[type];
      eventCenter(elm, 'mouseenter', enter, false);
      eventCenter(elm, 'mouseleave', leave, false);
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      isMouseDown = true;
      ref(pressing, window);
    }, 500);
  }

  function pressing() {
    if (isMouseDown && !isMouseout) {
      parent.scrollBy(
        {
          ['d' + ctx.bar.axis.toLowerCase()]: mousedownStepWithDirection
        },
        false
      );
      ref(pressing, window);
    }
  }

  function endPress() {
    clearTimeout(timeoutId);
    isMouseDown = false;
    eventCenter(document, endEventName, endPress, false, 'off');
    if (env == 'mouse') {
      const elm = ctx.$refs[type];
      eventCenter(elm, 'mouseenter', enter, false, 'off');
      eventCenter(elm, 'mouseleave', leave, false, 'off');
    }
  }

  function enter() {
    isMouseout = false;
    pressing();
  }

  function leave() {
    isMouseout = true;
  }

  return start;
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

function createScrollbarButton(h, barContext, type) {
  if (!barContext.ops.scrollButton.enable) {
    return null;
  }

  const size = barContext.ops.rail.size;
  const borderColor = barContext.ops.scrollButton.background;
  const wrapperProps = {
    class: ['__bar-button', '__bar-button-is-' + barContext.type + '-' + type],
    style: {
      [barContext.bar.scrollButton[type]]: 0,
      width: size,
      height: size
    },
    ref: type
  };

  const innerProps = {
    class: '__bar-button-inner',
    style: {
      border: `calc(${size} / 2.5) solid ${borderColor}`
    },
    on: {}
  };

  /* istanbul ignore next */
  {
    if (isSupportTouch()) {
      innerProps.on['touchstart'] = createScrollButtonEvent(
        barContext,
        type,
        'touch'
      );
    } else {
      innerProps.on['mousedown'] = createScrollButtonEvent(barContext, type);
    }
  }

  return (
    <div {...wrapperProps}>
      <div {...innerProps} />
    </div>
  );
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
    const railSize = vm.ops.rail.size;
    const rail = {
      class: `__rail-is-${vm.type}`,
      style: {
        borderRadius: vm.ops.rail.specifyBorderRadius || railSize,
        background: railBackgroundColor,
        border: vm.ops.rail.border,
        [vm.bar.opsSize]: railSize,
        [vm.bar.posName]: vm.ops.rail['gutterOfEnds'] || railSize,
        [vm.bar.opposName]: vm.ops.rail['gutterOfEnds'] || railSize,
        [vm.bar.sidePosName]: vm.ops.rail['gutterOfSide']
      }
    };

    // left space for scroll button
    const buttonSize = vm.ops.scrollButton.enable ? railSize : 0;
    const barWrapper = {
      class: `__bar-wrap-is-${vm.type}`,
      style: {
        borderRadius: vm.ops.rail.specifyBorderRadius || railSize,
        [vm.bar.posName]: buttonSize,
        [vm.bar.opposName]: buttonSize
      },
      on: {}
    };

    /* istanbul ignore if */
    if (isSupportTouch()) {
      bar.on['touchstart'] = createBarEvent(this, 'touch');
      barWrapper.on['touchstart'] = createTrackEvent(this, 'touchstart');
    } else {
      bar.on['mousedown'] = createBarEvent(this);
      barWrapper.on['mousedown'] = createTrackEvent(this, 'mousedown');
    }

    return (
      <div {...rail}>
        {createScrollbarButton(h, this, 'start')}
        {this.hideBar ? null : (
          <div {...barWrapper}>
            <div {...bar} />
          </div>
        )}
        {createScrollbarButton(h, this, 'end')}
      </div>
    );
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
      if (this.isBarDragging || !this.originBarStyle) return;

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
        rail: vm.mergedOptions.rail,
        scrollButton: vm.mergedOptions.scrollButton
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
