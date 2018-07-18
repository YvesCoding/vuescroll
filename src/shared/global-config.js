import { modes } from './constants';
import { error, warn } from '../util';

export default {
  // vuescroll
  vuescroll: {
    mode: 'native',
    // vuescroll's size(height/width) should be a percent(100%)
    // or be a number that is equal to its parentNode's width or
    // height ?
    sizeStrategy: 'percent',
    /** Whether to detect dom resize or not */
    detectResize: true,
    // pullRefresh or pushLoad is only for the slide mode...
    pullRefresh: {
      enable: false,
      tips: {
        deactive: 'Pull to Refresh',
        active: 'Release to Refresh',
        start: 'Refreshing...',
        beforeDeactive: 'Refresh Successfully!'
      }
    },
    pushLoad: {
      enable: false,
      tips: {
        deactive: 'Push to Load',
        active: 'Release to Load',
        start: 'Loading...',
        beforeDeactive: 'Load Successfully!'
      }
    },
    paging: false,
    zooming: true,
    snapping: {
      enable: false,
      width: 100,
      height: 100
    },
    /* shipped scroll options */
    scroller: {
      /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
      bouncing: true,
      /** Enable locking to the main axis if user moves only slightly on one of them at start */
      locking: true,
      /** Minimum zoom level */
      minZoom: 0.5,
      /** Maximum zoom level */
      maxZoom: 3,
      /** Multiply or decrease scrolling speed **/
      speedMultiplier: 1,
      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration: 0.03,
      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration: 0.08,
      /** Whether call e.preventDefault event when sliding the content or not */
      preventDefault: true
    }
  },
  scrollPanel: {
    // when component mounted.. it will automatically scrolls.
    initialScrollY: false,
    initialScrollX: false,
    // feat: #11
    scrollingX: true,
    scrollingY: true,
    speed: 300,
    easing: undefined
  },
  //
  scrollContent: {
    padding: false
  },
  //
  rail: {
    background: '#01a99a',
    opacity: 0,
    /** Rail's size(Height/Width) , default -> 6px */
    size: '6px'
  },
  bar: {
    /** How long to hide bar after mouseleave, default -> 500 */
    showDelay: 500,
    /** Whether to show bar on scrolling, default -> true */
    onlyShowBarOnScroll: true,
    /** Whether to keep show or not, default -> false */
    keepShow: false,
    /** Bar's background , default -> #00a650 */
    background: '#c1c1c1',
    /** Bar's opacity, default -> 1  */
    opacity: 1,
    /** Styles when you hover scrollbar, it will merge into the current style */
    hoverStyle: false
  }
};
/**
 * validate the options
 *
 * @export
 * @param {any} ops
 */
export function validateOptions(ops) {
  let shouldStopRender = false;
  const { vuescroll, scrollPanel } = ops;
  const { vBar, hBar } = ops.bar;
  const { vRail, hRail } = ops.rail;

  // validate modes
  if (!~modes.indexOf(vuescroll.mode)) {
    error(
      `Unknown mode: ${
        vuescroll.mode
      },the vuescroll's option "mode" should be one of the ${modes}`
    );
    shouldStopRender = true;
  }

  // validate pushLoad, pullReresh, snapping
  if (
    vuescroll.paging == vuescroll.snapping.enable &&
    vuescroll.paging &&
    (vuescroll.pullRefresh || vuescroll.pushLoad)
  ) {
    error(
      'paging, snapping, (pullRefresh with pushLoad) can only one of them to be true.'
    );
  }

  // validate scrollPanel
  const initialScrollY = scrollPanel['initialScrollY'];
  const initialScrollX = scrollPanel['initialScrollX'];

  if (initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
    warn(
      'The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.'
    );
  }
  if (initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
    warn(
      'The prop `initialScrollY` or `initialScrollX` should be a percent number like `10%` or an exact number that greater than or equal to 0 like `100`.'
    );
  }

  // validate deprecated vBar/hBar vRail/hRail
  if (vBar || hBar || vRail || hRail) {
    warn(
      'The options: vRail, hRail, vBar, hBar have been deprecated since v4.7.0,' +
        'please use corresponing rail/bar instead!'
    );
  }

  return shouldStopRender;
}
