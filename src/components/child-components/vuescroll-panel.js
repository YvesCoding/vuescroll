// begin importing
import {
  getGutter,
  hideSystemBar,
  createDomStyle,
  isSupportGivenStyle
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
      if (this.ops.initialScrollX) {
        x = this.ops.initialScrollX;
      }
      if (this.ops.initialScrollY) {
        y = this.ops.initialScrollY;
      }
      if (x || y) {
        this.$parent.scrollTo({ x, y });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this._isDestroyed) {
        this.updateInitialScroll();
      }
    });
  },
  render(h) {
    // eslint-disable-line
    let data = {
      class: ['vuescroll-panel']
    };
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
    style: {
      position: 'relative',
      height: '100%'
    },
    nativeOn: {
      scroll: vm.handleScroll
    },
    props: {
      ops: vm.mergedOptions.scrollPanel,
      state: vm.scrollPanel.state
    }
  };
  // set overflow only if the in native mode
  if (vm.mode == 'native') {
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
    if (!gutter) {
      hideSystemBar();
      scrollPanelData.style.height = '100%';
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
    scrollPanelData.style['transformOrigin'] = 'left top 0px';
    scrollPanelData.style['userSelect'] = 'none';
    scrollPanelData.style['height'] = '';
    // add box-sizing for sile mode because
    // let's use scrollPanel intead of scrollContent to wrap content
    scrollPanelData.style['box-sizing'] = 'border-box';
    let width = isSupportGivenStyle('width', 'fit-content');
    if (width) {
      scrollPanelData.style['width'] = width;
    } /* istanbul ignore next */ else {
      scrollPanelData['min-width'] = '100%';
      scrollPanelData['min-height'] = '100%';
    }
  } else if (vm.mode == 'pure-native') {
    scrollPanelData.style['width'] = '100%';
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
    // handle for refresh
    if (vm.mergedOptions.vuescroll.pullRefresh.enable) {
      // use default refresh dom
      createDomStyle('refreshDomStyle');
      let refreshDom = null;
      refreshDom = createTipDom(h, vm, 'refresh');
      renderChildren.unshift(
        <div class="vuescroll-refresh" ref="refreshDom" key="refshDom">
          {[refreshDom, vm.pullRefreshTip]}
        </div>
      );
    }
    // handle for load
    if (vm.mergedOptions.vuescroll.pushLoad.enable) {
      createDomStyle('loadDomStyle');
      let loadDom = null;
      loadDom = createTipDom(h, vm, 'load');
      // no slot load elm, use default
      renderChildren.push(
        <div class="vuescroll-load" ref="loadDom" key="loadDom">
          {[loadDom, vm.pushLoadTip]}
        </div>
      );
    }
    return renderChildren;
  } else if (vm.mode == 'pure-native') {
    return [vm.$slots.default];
  }
}
// create load or refresh tip dom
function createTipDom(h, vm, type) {
  const stage = vm.vuescroll.state[`${type}Stage`];
  let dom = null;
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
