import { isSupportGivenStyle, isIE, isArray } from 'shared/util';

export function processPanelData(vm) {
  // scrollPanel data start
  const scrollPanelData = {
    ref: 'scrollPanel',
    style: {},
    class: [],
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel
    }
  };

  scrollPanelData.class.push('__slide');

  let width = isSupportGivenStyle('width', 'fit-content');
  if (width) {
    scrollPanelData.style['width'] = width;
  } /* istanbul ignore next */ else {
    /* 
             * Fallback to inline-block while browser doesn't support fit-content
             */
    scrollPanelData['display'] = 'inline-block';
  }

  return scrollPanelData;
}

export function createPanelChildren(h, vm) {
  let renderChildren = [vm.$slots.default];

  /**
   *  Keep the children-rendered-order in case of the style crash
   *  when push-load or pull-refresh is enable
   */
  let _customPanel = vm.$slots['scroll-panel'];
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
  if (vm.mergedOptions.vuescroll.pullRefresh.enable) {
    let refreshDom = createTipDom(h, vm, 'refresh');
    renderChildren.unshift(
      <div class="__refresh" ref="refreshDom" key="refshDom">
        {[refreshDom, vm.pullRefreshTip]}
      </div>
    );
  }

  // handle load
  if (vm.mergedOptions.vuescroll.pushLoad.enable) {
    let loadDom = createTipDom(h, vm, 'load');
    const enableLoad = vm.isEnableLoad();

    renderChildren.push(
      <div
        ref="loadDom"
        key="loadDom"
        class={{ __load: true, '__load-disabled': !enableLoad }}
      >
        {[loadDom, vm.pushLoadTip]}
      </div>
    );
  }

  return renderChildren;
}

// Create load or refresh tip dom of each stages
function createTipDom(h, vm, type) {
  const stage = vm.vuescroll.state[`${type}Stage`];
  let dom = null;
  /* istanbul ignore if */
  if ((dom = vm.$slots[`${type}-${stage}`])) {
    return dom[0];
  }
  switch (stage) {
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
    // IE and edge seem not supporting  tag - `animateTransform`
    // Just return null.
    /* istanbul ignore if */
    if (isIE()) {
      dom = null;
      break;
    }
    dom = (
      <svg
        version="1.1"
        id="loader-1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 50 50"
        style="enable-background:new 0 0 50 50;"
        xmlSpace="preserve"
      >
        <path
          fill="#000"
          d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
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
 * @param {any} vm
 * @returns
 */
export function createPanel(h, vm) {
  let scrollPanelData = processPanelData(vm);

  return (
    <scrollPanel {...scrollPanelData}>{createPanelChildren(h, vm)}</scrollPanel>
  );
}
