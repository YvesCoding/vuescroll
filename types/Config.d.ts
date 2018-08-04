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
  mode?: 'native' | 'slide';
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
}

interface scrollConent {
  padding?: boolean;
}

interface rail {
  /** Rail's background , default -> #01a99a */
  background?: string;
  /** Rail's opacity, default -> 0  */
  opacity?: number;
  /** Rail's size(Height/Width) , default -> 6px */
  size?: string;
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

export default interface Config {
  vuescroll?: Container;
  scrollPanel?: scrollPanel;
  scrollConent?: scrollConent;
  bar?: bar;
  rail?: rail;
}
