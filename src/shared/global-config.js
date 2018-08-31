import { warn, mergeObject } from './util';

const baseConfig = {
  // vuescroll
  vuescroll: {
    // vuescroll's size(height/width) should be a percent(100%)
    // or be a number that is equal to its parentNode's width or
    // height ?
    sizeStrategy: 'percent',
    /** Whether to detect dom resize or not */
    detectResize: true
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
  rail: {
    background: '#01a99a',
    opacity: 0,
    /** Rail's size(Height/Width) , default -> 6px */
    size: '6px',
    /** Specify rail and bar's border-radius, default -> false **/
    specifyBorderRadius: false
  },
  bar: {
    /** How long to hide bar after mouseleave, default -> 500 */
    showDelay: 500,
    /** Whether to show bar on scrolling, default -> true */
    onlyShowBarOnScroll: true,
    /** Whether to keep show or not, default -> false */
    keepShow: false,
    /** Bar's background , default -> #00a650 */
    background: 'rgb(3, 185, 118)',
    /** Bar's opacity, default -> 1  */
    opacity: 1,
    /** Styles when you hover scrollbar, it will merge into the current style */
    hoverStyle: false
  }
};
export default baseConfig;

/**
 * validate the options
 * @export
 * @param {any} ops
 */
export function validateOps(ops) {
  let renderError = false;
  const { scrollPanel } = ops;
  const { vBar, hBar } = ops.bar;
  const { vRail, hRail } = ops.rail;

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

  if (_extraValidate) {
    _extraValidate = [].concat(_extraValidate);
    _extraValidate.forEach(hasError => {
      if (hasError(ops)) {
        renderError = true;
      }
    });
  }
  return renderError;
}

let _extraValidate = null;
export const extendOpts = (extraOpts, extraValidate) => {
  extraOpts = [].concat(extraOpts);
  extraOpts.forEach(opts => {
    mergeObject(opts, baseConfig);
  });

  _extraValidate = extraValidate;
};
