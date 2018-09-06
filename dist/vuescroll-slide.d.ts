import Vue from 'vue';

/**
 * Augment the typings of Vue.js
 */
declare module 'vue/types/vue' {
  interface Vue {
    $vuescrollConfig: Config;
  }
}

interface Tips {
  deactive?: string;
  active?: string;
  start?: string;
  beforeDeactive?: string;
}

interface PullRefreshOrPushLoad {
  enable?: boolean;
  tips?: Tips;
}

interface Snapping {
  enable?: boolean;
  width?: number;
  height?: number;
}

interface Scroller {
  /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
  bouncing?: boolean;
  /** Enable locking to the main axis if user moves only slightly on one of them at start */
  locking?: boolean;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Multiply or decrease scrolling speed **/
  speedMultiplier?: number;
  /** This configures the amount of change applied to deceleration when reaching boundaries  **/
  penetrationDeceleration?: number;
  /** This configures the amount of change applied to acceleration when reaching boundaries  **/
  penetrationAcceleration?: number;
  /** Whether call e.preventDefault event when sliding the content or not */
  preventDefault?: boolean;
}

interface Container {
  sizeStrategy?: 'percent' | 'number';
  detectResize?: boolean;
  pullRefresh?: PullRefreshOrPushLoad;
  pushLoad?: PullRefreshOrPushLoad;
  paging?: boolean;
  zooming?: boolean;
  snapping?: Snapping;
  scroller?: Scroller;
}

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
}

interface rail {
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
  /** Styles when you hover scrollbar, it will merge into the current style */
  hoverStyle?: false | Style;
}

export interface Config {
  vuescroll?: Container;
  scrollPanel?: scrollPanel;
  scrollConent?: scrollConent;
  bar?: bar;
  rail?: rail;
}

type Pos = {
  x: number | string;
  y: number | string;
};

type Page = {
  x: number;
  y: number;
};

export default interface vuescroll extends Vue {
  // ----------------------- Static methods --------------------
  static install(vue: typeof Vue): void;
  static refreshAll(): void;

  // ----------------------- Api -------------------------

  /**
   * @description Refresh the current vuescroll's all states
   * @memberof vuescroll
   */
  refresh(): void;
  /**
   * @description
   * @param {Pos} position The position you want to scroll to
   * @param {boolean} anmiate Whether to use scrolling Animations, defaults to true
   * @memberof vuescroll
   */
  scrollTo(position: Pos, anmiate?: boolean): void;

  /**
   * @description
   * @param {Pos} delta The delta you want to scroll based on current position
   * @param {boolean} anmiate Whether to use scrolling Animations, defaults to true
   * @memberof vuescroll
   */
  scrollBy(delta: Pos, anmiate?: boolean): void;

  /**
   * @description zoomby,  only valid in slide mode!
   * @param {number} factor The factor you want to zoom based on current factor
   * @param {boolean} [animate]
   * @param {number} [originLeft]
   * @param {number} [originTop]
   * @param {() => void} [callback]
   * @memberof vuescroll
   */
  zoomBy(
    factor: number,
    animate?: boolean,
    originLeft?: number,
    originTop?: number,
    callback?: () => void
  ): void;

  /**
   * @description zoom to a level, only valid in slide mode !
   * @param {number} level The level you want to zoom to.
   * @param {boolean} [animate]
   * @param {*} [originLeft]
   * @param {*} [originTop]
   * @param {*} [callback]
   * @memberof vuescroll
   */
  zoomTo(
    level: number,
    animate?: boolean,
    originLeft?: number,
    originTop?: number,
    callback?: () => void
  ): void;

  /**
   * @description Get the current page, only vaild in mode is slide and pagind is true!
   * @returns {Page}
   * @memberof vuescroll
   */
  getCurrentPage(): Page;

  /**
   * @description Go to a given page
   * @param {Page} page
   * @param {boolean} [animate]
   * @memberof vuescroll
   */
  goToPage(page: Page, animate?: boolean): void;

  /**
   * @description Trigger refresh or load's start stage directly!
   * @memberof vuescroll
   */
  triggerRefreshOrLoad(type: 'refresh' | 'load'): void;

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
}
