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

    let delta =
      event[ctx.bar.client] -
      thubmParent.getBoundingClientRect()[ctx.bar.posName];
    delta = delta / ctx.barRatio;

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

  // bar props: type
  const barType = ctx.type;

  let isMouseDown = false;
  let isMouseout = true;
  let timeoutId;

  function start(e) {
    /* istanbul ignore if */

    if (3 == e.which) {
      return;
    }

    // set class hook
    parent.setClassHook(`cliking${barType}${type}Button`, true);

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

    parent.setClassHook(`cliking${barType}${type}Button`, false);
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
      height: size,
      position: 'absolute',
      cursor: 'pointer',
      display: 'table'
    },
    ref: type
  };

  const innerProps = {
    class: '__bar-button-inner',
    style: {
      border: `calc(${size} / 2.5) solid transparent`,
      width: '0',
      height: '0',
      margin: 'auto',
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      left: '0'
    },
    on: {}
  };

  if (barContext.type == 'vertical') {
    if (type == 'start') {
      innerProps.style['border-bottom-color'] = borderColor;
      innerProps.style['transform'] = 'translateY(-25%)';
    } else {
      innerProps.style['border-top-color'] = borderColor;
      innerProps.style['transform'] = 'translateY(25%)';
    }
  } else {
    if (type == 'start') {
      innerProps.style['border-right-color'] = borderColor;
      innerProps.style['transform'] = 'translateX(-25%)';
    } else {
      innerProps.style['border-left-color'] = borderColor;
      innerProps.style['transform'] = 'translateX(25%)';
    }
  }

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
    ops: Object,
    state: Object,
    hideBar: Boolean,
    otherBarHide: Boolean,
    type: String
  },
  computed: {
    bar() {
      return scrollMap[this.type];
    },
    barSize() {
      return Math.max(this.state.size, this.ops.bar.minSize);
    },
    barRatio() {
      return (1 - this.barSize) / (1 - this.state.size);
    }
  },
  render(h) {
    const vm = this;
    /** Get rgbA format background color */
    const railBackgroundColor = getRgbAColor(
      vm.ops.rail.background,
      vm.ops.rail.opacity
    );

    /** Rail Data */
    const railSize = vm.ops.rail.size;
    const endPos = vm.otherBarHide ? 0 : railSize;
    const rail = {
      class: `__rail-is-${vm.type}`,
      style: {
        position: 'absolute',
        'z-index': '1',

        borderRadius: vm.ops.rail.specifyBorderRadius || railSize,
        background: railBackgroundColor,
        border: vm.ops.rail.border,
        [vm.bar.opsSize]: railSize,
        [vm.bar.posName]: vm.ops.rail['gutterOfEnds'] || 0,
        [vm.bar.opposName]: vm.ops.rail['gutterOfEnds'] || endPos,
        [vm.bar.sidePosName]: vm.ops.rail['gutterOfSide']
      }
    };

    // left space for scroll button
    const buttonSize = vm.ops.scrollButton.enable ? railSize : 0;
    const barWrapper = {
      class: `__bar-wrap-is-${vm.type}`,
      style: {
        position: 'absolute',
        borderRadius: vm.ops.rail.specifyBorderRadius || railSize,
        [vm.bar.posName]: buttonSize,
        [vm.bar.opposName]: buttonSize
      },
      on: {}
    };

    const scrollDistance = vm.state.posValue * vm.state.size;
    const pos = (scrollDistance * vm.barRatio) / vm.barSize;
    const opacity = vm.state.opacity;
    const parent = getRealParent(this);

    // set class hook
    parent.setClassHook(
      this.type == 'vertical' ? 'vBarVisible' : 'hBarVisible',
      !!opacity
    );

    /** Scrollbar style */
    let barStyle = {
      cursor: 'pointer',
      position: 'absolute',
      margin: 'auto',
      transition: 'opacity 0.5s',
      'user-select': 'none',
      'border-radius': 'inherit',

      [vm.bar.size]: vm.barSize * 100 + '%',
      background: vm.ops.bar.background,
      [vm.bar.opsSize]: vm.ops.bar.size,
      opacity,
      transform: `translate${scrollMap[vm.type].axis}(${pos}%)`
    };
    const bar = {
      style: barStyle,
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

    if (vm.type == 'vertical') {
      barWrapper.style.width = '100%';
      // Let bar to be on the center.
      bar.style.left = 0;
      bar.style.right = 0;
    } else {
      barWrapper.style.height = '100%';
      bar.style.top = 0;
      bar.style.bottom = 0;
    }

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

      // set class hooks

      const parent = getRealParent(this);
      // set class hook
      parent.setClassHook(
        this.type == 'vertical' ? 'vBarDragging' : 'hBarDragging',
        !!val
      );

      if (!val) {
        this.tryRestoreBarStyles();
      }
    },
    tryRestoreBarStyles() {
      /* istanbul ignore if */
      if (this.isBarDragging || !this.originBarStyle) return;

      Object.keys(this.originBarStyle).forEach((key) => {
        this.$refs.thumb.style[key] = this.originBarStyle[key];
      });
    },
    setBarHoverStyles() {
      let hoverBarStyle = this.ops.bar.hoverStyle;
      /* istanbul ignore next */
      if (!hoverBarStyle) return;

      if (!this.originBarStyle) {
        this.originBarStyle = {};
        Object.keys(hoverBarStyle).forEach((key) => {
          this.originBarStyle[key] = this.$refs.thumb.style[key];
        });
      }

      mergeObject(hoverBarStyle, this.$refs.thumb.style, true);
    }
  }
};

function getBarData(vm, type) {
  const axis = scrollMap[type].axis;
  /** type.charAt(0) = vBar/hBar */
  const barType = `${type.charAt(0)}Bar`;

  const hideBar =
    !vm.bar[barType].state.size ||
    !vm.mergedOptions.scrollPanel['scrolling' + axis] ||
    (vm.refreshLoad && type !== 'vertical') ||
    vm.mergedOptions.bar.disable;

  const keepShowRail = vm.mergedOptions.rail.keepShow;

  if (hideBar && !keepShowRail) {
    return null;
  }

  return {
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
    ref: `${type}Bar`,
    key: type
  };
}

/**
 * create bars
 *
 * @param {any} size
 * @param {any} type
 */
export function createBar(h, vm) {
  const verticalBarProps = getBarData(vm, 'vertical');
  const horizontalBarProps = getBarData(vm, 'horizontal');

  // set class hooks
  vm.setClassHook('hasVBar', !!verticalBarProps);
  vm.setClassHook('hasHBar', !!horizontalBarProps);

  return [
    verticalBarProps ? (
      <bar
        {...{
          ...verticalBarProps,
          ...{
            props: {
              ...{ otherBarHide: !horizontalBarProps },
              ...verticalBarProps.props
            }
          }
        }}
      />
    ) : null,
    horizontalBarProps ? (
      <bar
        {...{
          ...horizontalBarProps,
          ...{
            props: {
              ...{ otherBarHide: !verticalBarProps },
              ...horizontalBarProps.props
            }
          }
        }}
      />
    ) : null
  ];
}
