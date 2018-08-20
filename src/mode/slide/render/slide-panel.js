import { getComplitableStyle, isArray } from 'shared/util';

export function getPanelData(context) {
  // scrollPanel data start
  const data = {
    ref: 'scrollPanel',
    style: {},
    class: [],
    nativeOn: {
      scroll: context.handleScroll
    },
    props: {
      ops: context.mergedOptions.scrollPanel
    }
  };

  data.class.push('__slide');

  let width = getComplitableStyle('width', 'fit-content');
  if (width) {
    data.style['width'] = width;
  } /* istanbul ignore next */ else {
    data['display'] = 'inline-block';
  }

  if (context.mergedOptions.scrollPanel.padding) {
    data.style.paddingRight = context.mergedOptions.rail.size;
  }

  return data;
}

export function getPanelChildren(h, context) {
  let renderChildren = [context.$slots.default];

  /**
   *  Keep the children-rendered-order in case of the style crash
   *  when push-load or pull-refresh is enable
   */
  let _customPanel = context.$slots['scroll-panel'];
  if (_customPanel) {
    /* istanbul ignore if */
    if (_customPanel.length > 1) {
      renderChildren = _customPanel.concat(renderChildren);
    } else {
      _customPanel = _customPanel[0];
      const ch = _customPanel.children;

      if (isArray(ch)) {
        renderChildren = ch.concat(renderChildren);
      }
    }
  }

  // handle refresh
  if (context.mergedOptions.vuescroll.pullRefresh.enable) {
    let refreshDom = createTipDom(h, context, 'refresh');
    renderChildren.unshift(
      <div class="__refresh" ref="refreshDom" key="refshDom">
        {[refreshDom, context.pullRefreshTip]}
      </div>
    );
  }

  // handle load
  if (context.mergedOptions.vuescroll.pushLoad.enable) {
    let loadDom = createTipDom(h, context, 'load');
    const enableLoad = context.isEnableLoad();

    renderChildren.push(
      <div
        ref="loadDom"
        key="loadDom"
        class={{ __load: true, '__load-disabled': !enableLoad }}
      >
        {[loadDom, context.pushLoadTip]}
      </div>
    );
  }

  return renderChildren;
}

// Create load or refresh tip dom of each stages
function createTipDom(h, context, type) {
  const stage = context.vuescroll.state[`${type}Stage`];
  let dom = null;
  // Return user specified animation dom
  /* istanbul ignore if */
  if ((dom = context.$slots[`${type}-${stage}`])) {
    return dom[0];
  }

  switch (stage) {
  // The dom will show at deactive stage
  case 'deactive':
    dom = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000"
        xmlSpace="preserve"
      >
        <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
        <g>
          <g transform="matrix(1 0 0 -1 0 1008)">
            <path d="M10,543l490,455l490-455L885,438L570,735.5V18H430v717.5L115,438L10,543z" />
          </g>
        </g>
      </svg>
    );
    break;
  case 'start':
    dom = (
      <svg viewBox="0 0 50 50" class="start">
        <circle stroke="true" cx="25" cy="25" r="20" class="bg-path" />
        <circle cx="25" cy="25" r="20" class="active-path" />
      </svg>
    );
    break;
  case 'active':
    dom = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000"
        xmlSpace="preserve"
      >
        <metadata> Svg Vector Icons : http://www.sfont.cn </metadata>
        <g>
          <g transform="matrix(1 0 0 -1 0 1008)">
            <path d="M500,18L10,473l105,105l315-297.5V998h140V280.5L885,578l105-105L500,18z" />
          </g>
        </g>
      </svg>
    );
    break;
  }
  return dom;
}

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} context
 * @returns
 */
export function createPanel(h, context) {
  let data = getPanelData(context);

  return <scrollPanel {...data}>{getPanelChildren(h, context)}</scrollPanel>;
}
