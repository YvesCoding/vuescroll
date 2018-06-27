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
  mode?: 'native' | 'pure-native' | 'slide';
  sizeStrategy?: 'percent' | 'number';
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

interface vRail {
  width?: string;
  pos?: string;
  background?: string;
  opacity?: number;
}

interface hRail {
  height?: string;
  pos?: string;
  background?: string;
  opacity?: number;
}

interface rail {
  VRail?: vRail;
  HRail?: hRail;
}

interface BarType {
  background?: string;
  keepShow?: boolean;
  opacity?: number;
  hover?: false | string;
}

interface bar {
  showDelay?: number;
  VBar?: BarType;
  HBar?: BarType;
}

export default interface Config {
  vuescroll?: Container;
  scrollPanel?: scrollPanel;
  scrollConent?: scrollConent;
  bar?: bar;
  rail?: rail;
}
