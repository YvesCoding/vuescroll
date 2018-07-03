// begin importing
import {
  getGutter,
  isSupportGivenStyle,
  isIE,
  insertChildrenIntoSlot,
  getRealParent
} from '../../util';
import { createContent } from './vuescroll-content';
// vueScrollPanel
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
      class: ['__panel']
    };
    const parent = getRealParent(this);
    const customPanel = parent.$slots['scroll-panel'];
    if (customPanel) {
      return insertChildrenIntoSlot(h, customPanel, this.$slots.default, data);
    }
    return <div {...data}>{[this.$slots.default]}</div>;
  }
};

/**
 * create a scrollPanel
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createPanel(h, vm) {
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
  // set overflow only if the in native mode
  if (vm.mode == 'native') {
    scrollPanelData.class.push('__native');
    // dynamic set overflow scroll
    // feat: #11
    if (vm.mergedOptions.scrollPanel.scrollingY) {
      scrollPanelData.style['overflowY'] = vm.bar.vBar.state.size
        ? 'scroll'
        : '';
    } else {
      scrollPanelData.style['overflowY'] = 'hidden';
    }
    if (vm.mergedOptions.scrollPanel.scrollingX) {
      scrollPanelData.style['overflowX'] = vm.bar.hBar.state.size
        ? 'scroll'
        : '';
    } else {
      scrollPanelData.style['overflowX'] = 'hidden';
    }
    let gutter = getGutter();
    /* istanbul ignore if */
    if (!gutter && vm.mergedOptions.vuescroll.mode != 'pure-native') {
      scrollPanelData.class.push('__hidebar');
    } else {
      // hide system bar by use a negative value px
      // gutter should be 0 when manually disable scrollingX #14
      if (vm.bar.vBar.state.size && vm.mergedOptions.scrollPanel.scrollingY) {
        scrollPanelData.style.marginRight = `-${gutter}px`;
      }
      if (vm.bar.hBar.state.size && vm.mergedOptions.scrollPanel.scrollingX) {
        scrollPanelData.style.height = `calc(100% + ${gutter}px)`;
      }
    }
    // clear legency styles of slide mode...
    scrollPanelData.style.transformOrigin = '';
    scrollPanelData.style.transform = '';
  } else if (vm.mode == 'slide') {
    scrollPanelData.class.push('__slide');
    let width = isSupportGivenStyle('width', 'fit-content');
    if (width) {
      scrollPanelData.style['width'] = width;
    } /* istanbul ignore next */ else {
      // fallback to inline block while
      // doesn't support 'fit-content',
      // this may cause some issues, but this
      // can make `resize` event work...
      scrollPanelData['display'] = 'inline-block';
    }
  } else if (vm.mode == 'pure-native') {
    scrollPanelData.class.push('__pure-native');
    if (vm.mergedOptions.scrollPanel.scrollingY) {
      scrollPanelData.style['overflowY'] = 'auto';
    } else {
      scrollPanelData.style['overflowY'] = 'hidden';
    }
    if (vm.mergedOptions.scrollPanel.scrollingX) {
      scrollPanelData.style['overflowX'] = 'auto';
    } else {
      scrollPanelData.style['overflowX'] = 'hidden';
    }
  }
  return (
    <scrollPanel {...scrollPanelData}>{createPanelChildren(vm, h)}</scrollPanel>
  );
}

function createPanelChildren(vm, h) {
  if (vm.mode == 'native') {
    return [createContent(h, vm)];
  } else if (vm.mode == 'slide') {
    let renderChildren = [vm.$slots.default];
    // handle refresh
    if (vm.mergedOptions.vuescroll.pullRefresh.enable) {
      let refreshDom = null;
      refreshDom = createTipDom(h, vm, 'refresh');
      renderChildren.unshift(
        <div class="__refresh" ref="refreshDom" key="refshDom">
          {[refreshDom, vm.pullRefreshTip]}
        </div>
      );
    }
    // handle load
    if (vm.mergedOptions.vuescroll.pushLoad.enable) {
      let loadDom = null;
      loadDom = createTipDom(h, vm, 'load');
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
  } else if (vm.mode == 'pure-native') {
    return [vm.$slots.default];
  }
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
