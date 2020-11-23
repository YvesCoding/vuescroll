import Vue from 'vue';
import { easing } from './Config';

type Pos = {
  x?: number | string;
  y?: number | string;
};

type Page = {
  x?: number;
  y?: number;
};

type Position = {
  scrollTop?: number;
  scrollLeft?: number;
};

export declare class vuescroll extends Vue {
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
