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

interface PushLoad {
  /** Whether auto load or not */
  auto?: boolean;
  autoLoadDistance?: number;
}

interface Snapping {
  enable?: boolean;
  width?: number;
  height?: number;
}

/**
 * BounceArray: Specify the bounce direction
 * ['top','bottom','left','right']
 */
type BounceArray = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

interface Scroller {
  /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
  bouncing?: BounceArray;
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
  // whether to disable scroller
  disable?: boolean;
}

interface Container {
  mode?: 'native' | 'slide';
  sizeStrategy?: 'percent' | 'number';
  renderMethod?: 'transform' | 'position';
  detectResize?: boolean;
  pullRefresh?: PullRefreshOrPushLoad;
  pushLoad?: PullRefreshOrPushLoad & PushLoad;
  paging?: boolean;
  zooming?: boolean;
  snapping?: Snapping;
  scroller?: Scroller;
  wheelScrollDuration?: number;
  wheelDirectionReverse?: boolean;
  checkShiftKey?: boolean;
  /** Enable locking to the main axis if user moves only slightly on one of them at start */
  locking?:boolean;
}

export declare type easing =
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

export default interface Config {
  vuescroll?: Container;
  scrollPanel?: scrollPanel;
  bar?: bar;
  rail?: rail;
  scrollButton?: scrollButton;
}
