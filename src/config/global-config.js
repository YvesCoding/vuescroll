export const modes = ["slide", "native", "pure-native"];
export default {
  // vuescroll
  vuescroll: {
    mode: "native",
    // pullRefresh or pushLoad is only for the slide mode...
    pullRefresh: {
      enable: false,
      tips: {
        deactive: "Pull to Refresh",
        active: "Release to Refresh",
        start: "Refreshing...",
        beforeDeactive: "Refresh Successfully!"
      }
    },
    pushLoad: {
      enable: false,
      tips: {
        deactive: "Push to Load",
        active: "Release to Load",
        start: "Loading...",
        beforeDeactive: "Load Successfully!"
      }
    },
    paging: false,
    snapping: {
      enable: false,
      width: 100,
      height: 100
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
    // customize tag of scrollContent
    tag: "div",
    padding: true,
    props: { },
    attrs: { }
  },
  //
  rail: {
    vRail: {
      width: "5px",
      pos: "right",
      background: "#a5d6a7",
      opacity: 0
    },
    // 
    hRail: {
      height: "5px",
      pos: "bottom",
      background: "#a5d6a7",
      opacity: 0
    }
  }, 
  bar: {
    // 
    vBar: {
      background: "#4caf50",
      deltaY: 100,
      keepShow: false,
      opacity: 1,
      hover: false
    },
    // 
    hBar: {
      background: "#4caf50",
      keepShow: false,
      opacity: 1,
      hover: false
    } 
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
  const {
    vuescroll, 
    scrollPanel
  } = ops;

    // validate vuescroll
  if(!~modes.indexOf(vuescroll.mode)) {
    console.error(`[vuescroll][ops]: The vuescroll's option "mode" should be one of the ${modes}`); //eslint-disable-line 
    shouldStopRender = true;
  }
  
  if((vuescroll.paging == vuescroll.snapping.enable) && vuescroll.paging && (vuescroll.pullRefresh || vuescroll.pushLoad)) {
    console.error(`[vuescroll][ops]: paging, snapping, (pullRefresh with pushLoad) can only one of them to be true.`); //eslint-disable-line 
  }
  // validate scrollPanel
  const initialScrollY = scrollPanel["initialScrollY"];
  const initialScrollX = scrollPanel["initialScrollX"];

  if(initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
    console.error("[vuescroll][ops]: The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100."); // eslint-disable-line 
  }

  if(initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
    console.error("[vuescroll][ops]: The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100."); // eslint-disable-line 
  }

  return shouldStopRender;
}