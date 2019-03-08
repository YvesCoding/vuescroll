import {
  getGutter,
  getComplitableStyle,
  insertChildrenIntoSlot,
  isIos,
  createHideBarStyle
} from 'shared/util';

export default function getPanelData(context) {
  // scrollPanel data start
  const data = {
    ref: 'scrollPanel',
    style: {
      height: '100%',
      overflowY: 'scroll',
      overflowX: 'scroll'
    },
    class: [],
    nativeOn: {
      '&scroll': context.handleScroll
    },
    props: {
      ops: context.mergedOptions.scrollPanel
    }
  };

  context.scrollYEnable = true;
  context.scrollXEnable = true;

  data.nativeOn.DOMMouseScroll = data.nativeOn.mousewheel =
    context.onMouseWheel;

  const { scrollingY, scrollingX } = context.mergedOptions.scrollPanel;

  if (!context.bar.hBar.state.size || !scrollingX) {
    context.scrollXEnable = false;
    data.style.overflowX = 'hidden';
  }

  if (!context.bar.vBar.state.size || !scrollingY) {
    context.scrollYEnable = false;
    data.style.overflowY = 'hidden';
  }

  let gutter = getGutter();
  /* istanbul ignore if */
  if (!gutter) {
    createHideBarStyle();
    data.class.push('__hidebar');
    if (isIos()) {
      data.style['-webkit-overflow-scrolling'] = 'touch';
    }
  } else {
    // hide system bar by use a negative value px
    // gutter should be 0 when manually disable scrollingX #14
    if (
      context.bar.vBar.state.size &&
      context.mergedOptions.scrollPanel.scrollingY
    ) {
      if (context.mergedOptions.scrollPanel.verticalNativeBarPos == 'right') {
        data.style.marginRight = `-${gutter}px`;
      } /* istanbul ignore next */ else {
        data.style.marginLeft = `-${gutter}px`;
      }
    }
    if (
      context.bar.hBar.state.size &&
      context.mergedOptions.scrollPanel.scrollingX
    ) {
      data.style.height = `calc(100% + ${gutter}px)`;
    }
  }

  // clear legency styles of slide mode...
  data.style.transformOrigin = '';
  data.style.transform = '';

  return data;
}

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} context
 * @returns
 */
export function createPanel(h, context) {
  let data = {};

  data = getPanelData(context);

  return <scrollPanel {...data}>{getPanelChildren(h, context)}</scrollPanel>;
}

export function getPanelChildren(h, context) {
  let viewStyle = {
    position: 'relative',
    'box-sizing': 'border-box',
    'min-width': '100%',
    'min-height': '100%'
  };
  const data = {
    style: viewStyle,
    ref: 'scrollContent',
    class: '__view'
  };
  const _customContent = context.$slots['scroll-content'];

  if (context.mergedOptions.scrollPanel.scrollingX) {
    viewStyle.width = getComplitableStyle('width', 'fit-content');
  } else {
    data.style['width'] = '100%';
  }

  if (context.mergedOptions.scrollPanel.padding) {
    data.style.paddingRight = context.mergedOptions.rail.size;
  }

  if (_customContent) {
    return insertChildrenIntoSlot(
      h,
      _customContent,
      context.$slots.default,
      data
    );
  }

  return <div {...data}>{context.$slots.default}</div>;
}
