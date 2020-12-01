import Vue from 'vue';

/**
 * Augment the typings of Vue.js
 */
declare module 'vue/types/vue' {
  interface Vue {
    $vuescrollConfig: Config;
  }
}

interface Container {
  sizeStrategy?: 'percent' | 'number';
  detectResize?: boolean;
  wheelScrollDuration?: number;
  wheelDirectionReverse?: boolean;
  checkShiftKey?: boolean;
  locking?:boolean;
}

type Position = {
  scrollTop?: number;
  scrollLeft?: number;
};

declare type easing =
  | 'easeInQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint';

interface scrollPanel {
  initialScrollY?: false | string | number;
  initialScrollX?: false | string | number;
  scrollingX?: boolean;
  scrollingY?: boolean;
  speed?: number;
  easing?: easing | undefined;
  padding?: boolean;
  verticalNativeBarPos?: 'right' | 'left';
  maxHeight?: number;
  maxWidth?: number;
}

interface rail {
  border?: string;
  /** Specify rail's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
  specifyBorderRadius?: boolean | string;
  /** Rail's background , default -> #01a99a */
  background?: string;
  /** Rail's opacity, default -> 0  */
  opacity?: number;
  /** Rail's size(Height/Width) , default -> 6px */
  size?: string;
  /** Rail the distance from the two ends of the X axis and Y axis. **/
  gutterOfEnds?: string;
  /** Rail the distance from the side of container. **/
  gutterOfSide?: string;
  /** Whether to keep rail show or not, default -> false, event content height is not enough */
  keepShow?: boolean;
}

type Partial<T> = { [P in keyof T]?: T[P] };
type Style = Partial<CSSStyleDeclaration>;

interface bar {
  /** Specify bar's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
  specifyBorderRadius?: boolean | string;
  /** How long to hide bar after mouseleave, default -> 500 */
  showDelay?: number;
  /** Whether to keep show or not, default -> false */
  keepShow?: boolean;
  /** Whether to show bar on scrolling, default -> true */
  onlyShowBarOnScroll?: boolean;
  /** Bar's background , default -> #00a650 */
  background?: string;
  /** Bar's opacity, default -> 1  */
  opacity?: number;
  // Sometimes, the nativebar maybe on the left,
  // See https://github.com/YvesCoding/vuescroll/issues/64
  verticalNativeBarPos?: 'right';
  // A number in a range of (0, 1),
  // such as 0.5, means 50%. 0.3 means 30%.
  minSize?: number;
  // fix #142
  size?: string;
  // disable bar or not
  disable?: boolean;
}

interface scrollButton {
  enable?: boolean;
  background?: string;
  opacity?: number;
  step?: number;
  mousedownStep?: number;
}

export interface Config {
  vuescroll?: Container;
  scrollPanel?: scrollPanel;
  scrollConent?: scrollConent;
  bar?: bar;
  rail?: rail;
  scrollButton?: scrollButton;
}

type Pos = {
  x?: number | string;
  y?: number | string;
};

type Page = {
  x?: number;
  y?: number;
};

export default interface vuescroll extends Vue {
  // ----------------------- Static methods --------------------
  static install(vue: typeof Vue): void;
  static refreshAll(): void;
  static scrollTo(
    elm: Document | Element,
    x: string | number,
    y: string | number,
    speed?: number,
    easing?: easing,
    animate?: boolean,
    scrollingComplete?: (x: string | number, y: string | number) => void
  ): void;

  // ----------------------- Api -------------------------

  /**
   * @description Refresh the current vuescroll's all states
   * @memberof vuescroll
   */
  refresh(): void;

  /**
   * @description
   * @param {Pos} position The position you want to scroll to
   * @param {number} speed the speed of the scrolling, the smaller, the faster.
   * @param {easing} easing the animation of scrolling.
   * @memberof vuescroll
   */
  scrollTo(position: Pos, speed?: number, easing?: easing): void;

  /**
   * @description
   * @param {Pos} delta The delta you want to scroll based on current position
   * @param {number} speed the speed of the scrolling, the smaller, the faster.
   * @param {easing} easing the animation of scrolling.
   * @memberof vuescroll
   */
  scrollBy(delta: Pos, speed?: number, easing?: easing): void;

  /**
   * @description Get the current doms you can see in the container!
   * @returns {Array<Element>}
   * @memberof vuescroll
   */
  getCurrentviewDom(): Array<Element>;

  /**
   * @description Scroll the element of vuescroll to your viewport!
   * @param {(Element | string)} elm
   * @param {boolean} [animate]
   * @memberof vuescroll
   */
  scrollIntoView(elm: Element | string, animate?: boolean): void;

  /**
   * @description Get the times you have scrolled
   * @author wangyi7099
   * @memberof vuescroll
   */
  getScrollingTimes(): void;

  /**
   * @description Clear the times you have scrolled
   * @author wangyi7099
   * @memberof vuescroll
   */
  clearScrollingTimes(): void;
  /**
   * @description Stop current scrolling, can be only used in native
   * @author wangyi7099
   * @memberof vuescroll
   */
  stop(): void;
  /**
   * @description Pause current scrolling, can be only used in native
   * @author wangyi7099
   * @memberof vuescroll
   */
  pause(): void;

  /**
   * @description Continue the paused scrolling, can be only used in native
   * @author wangyi7099
   * @memberof vuescroll
   */
  continue(): void;

  /**
   * @description Get current position
   * @author wangyi7099
   * @memberof vuescroll
   */
  getPosition(): Position;
}
