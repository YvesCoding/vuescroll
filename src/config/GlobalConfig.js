export const modes = ['slide', 'native'];
export default {
    // vuescroll
    vuescroll: {
        mode: 'native',
        // pullRefresh or pushLoad is only for the slide mode...
        pullRefresh: {
            enable: false,
            tips: {
                deactive: "Pull to Refresh",
                active: "Release to Refresh",
                start: "Refreshing...",
                resultTip: "Refresh Successfully!"
            }
        }
        pushLoad: {
            enable: false,
            tips: {
                deactive: "Push to Load",
                active: "Loading...",
                start: "Release to Load",
                resultTip: "'Load Successfully!"
            }
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
        tag: 'div',
        padding: true,
        props: {
        },
        attrs: {
        }
    },
    // 
    vRail: {
        width: '5px',
        pos: 'right',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    hRail: {
        height: '5px',
        pos: 'bottom',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    vBar: {
        width: '5px',
        pos: 'right',
        background: '#4caf50',
        deltaY: 100,
        keepShow: false,
        opacity: 1,
        hover: false
    },
    // 
    hBar: {
        height: '5px',
        pos: 'bottom',
        background: '#4caf50',
        keepShow: false,
        opacity: 1,
        hover: false
    } 
}
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
        scrollPanel, 
        scrollContent, 
        vRail, 
        hRail,
        vBar,
        hBar
    } = ops;

    // validate vuescroll
    if(!~modes.indexOf(vuescroll.mode)) {
        console.error(`[vuescroll]: The vuescroll\'s option "mode" should be one of the ${modes}`)
        shouldStopRender = true;
    }

    // validate scrollPanel
    const initialScrollY = scrollPanel['initialScrollY'];
    const initialScrollX = scrollPanel['initialScrollX'];

    if(initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
        console.error('[vuescroll]: The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.')
    }

    if(initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
        console.error('[vuescroll]: The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.')
    }

    return shouldStopRender;
}