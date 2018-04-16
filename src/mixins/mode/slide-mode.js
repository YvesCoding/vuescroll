// import scroller
import Scroller from '../../util/scroller'
import {
    render 
} from '../../util/scroller/render'
import {
    listenContainer
}from '../../util/scroller/listener'

let activateCallback = function() {
    const refreshElem = this.$refs['refreshDom'].elm || this.$refs['refreshDom'];
    this.vuescroll.state.refreshStage = 'active';
}

let startCallback = function() {
    let vm = this;
    vm.vuescroll.state.refreshStage = 'start';
    setTimeout(function() {
        vm.scroller.finishPullToRefresh();
    }, 2000);
}

let beforeDeactivateCallback = function(done) {
    vm.vuescroll.state.refreshStage = "beforeDeactive";
    setTimeout(function() {
        done();
    }, 500);
}

let deactivateCallback = function() {
    this.vuescroll.state.refreshStage = 'deactive';
}



export default {
    methods: {
        updateScroller() {
            const clientWidth = this.$el.clientWidth;
            const clientHeight = this.$el.clientHeight;
            let contentWidth = this.scrollPanelElm.scrollWidth;
            let contentHeight = this.scrollPanelElm.scrollHeight;
            let refreshHeight = 0;
            let loadHeight = 0;
            // If the refresh option is true,let's  give a "margin-top" style to 
            // the refresh-tip dom. let it to be invisible when doesn't trigger
            // refresh.
            if(this.mergedOptions.vuescroll.pullRefresh.enable) {
                const refreshDom = this.$refs['refreshDom'].elm || this.$refs['refreshDom'];
                refreshHeight = refreshDom.scrollHeight;
                refreshDom.style.marginTop = -refreshHeight + 'px';
                // the content height should subtracting the refresh dom height
                contentHeight -= refreshHeight; 
                // fix the width.
                contentWidth = clientWidth;
            }
            if(this.mergedOptions.vuescroll.pushLoad.enable) {
                const loadDom = this.$refs['loadDom'].elm || this.$refs['loadDom'];
                loadHeight = loadDom.scrollHeight;
                // need not to show the loading dom..
                contentHeight -= loadHeight; 
            }
            this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
        },
        registryScroller() {
             // disale zooming when refresh enabled
            let zooming = !this.mergedOptions.vuescroll.pullRefreshEnable;
            const {scrollingY, scrollingX} = this.mergedOptions.scrollPanel;
            // Initialize Scroller
            this.scroller = new Scroller(render(this.scrollPanelElm, window), {
                zooming,
                scrollingY,
                scrollingX,
                animationDuration: this.mergedOptions.scrollPanel.speed
            });
            var rect = this.$el.getBoundingClientRect();
            this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop);    
            const cb = listenContainer(this.$el, this.scroller, (eventType) => {
                // Thie is to dispatch the event from the scroller.
                // to let vuescroll refresh the dom
                switch(eventType) {
                    case 'mousedown':
                    this.vuescroll.state.isDragging = true;
                    break;
                    case 'onscroll':
                    this.handleScroll(false);
                    break;
                    case 'mouseup':
                    this.vuescroll.state.isDragging = false;
                    break;
                }
            }, zooming);
            // registry refresh
            if(this.mergedOptions.vuescroll.pullRefreshEnable) {
                const refreshDom = this.$refs['refreshDom'].elm || this.$refs['refreshDom'];
                if(this.$listeners['refresh-activate']) {
                    activateCallback = () => {
                        this.vuescroll.state.refreshStage = 0;
                        this.$emit('refresh-activate', this, refreshDom);
                    }
                }
                if(this.$listeners['refresh-deactivate']) {
                    deactivateCallback = () => {
                        this.vuescroll.state.refreshStage = 2;
                        this.$emit('refresh-deactivate', this, refreshDom);
                    }
                }
                if(this.$listeners['refresh-start']) {
                    startCallback = () => {
                        this.vuescroll.state.refreshStage = 1;
                        this.$emit('refresh-start', this, refreshDom, this.scroller.finishPullToRefresh.bind(this.scroller));
                    }
                }
                
                let refreshHeight = refreshDom.scrollHeight;
                this.scroller.activatePullToRefresh(
                    refreshHeight,
                    activateCallback.bind(this),
                    deactivateCallback.bind(this),
                    startCallback.bind(this)
                )
            }
            this.updateScroller();
            return cb;
        },
        updateSlideModeBarState() {
           // update slide mode scrollbars' state
           let heightPercentage, widthPercentage;
           const scrollPanel = this.scrollPanelElm;
           const vuescroll = this.$el;
           const scroller = this.scroller;
           let outerLeft = 0;
           let outerTop = 0;
           const clientWidth = vuescroll.clientWidth;
           const clientHeight = vuescroll.clientHeight;
           const contentWidth = clientWidth + this.scroller.__maxScrollLeft;
           const contentHeight = clientHeight + this.scroller.__maxScrollTop;
           const __enableScrollX = clientWidth < contentWidth;
           const __enableScrollY = clientHeight < contentHeight;
           // out of horizontal bountry 
           if(__enableScrollX) {
               if(scroller.__scrollLeft < 0) {
                   outerLeft = -scroller.__scrollLeft;
               } else if(scroller.__scrollLeft > scroller.__maxScrollLeft) {
                   outerLeft = scroller.__scrollLeft - scroller.__maxScrollLeft;
               }
           }
           // out of vertical bountry
           if(__enableScrollY) {
               if(scroller.__scrollTop < 0) {
                   outerTop = -scroller.__scrollTop;
               } else if(scroller.__scrollTop > scroller.__maxScrollTop) {
                   outerTop = scroller.__scrollTop - scroller.__maxScrollTop;
               }
           } 
           heightPercentage = (clientHeight * 100 / (contentHeight + outerTop));
           widthPercentage = (clientWidth * 100 / (contentWidth + outerLeft));
           const scrollTop = Math.min(Math.max(0, scroller.__scrollTop), scroller.__maxScrollTop);
           const scrollLeft = Math.min(Math.max(0, scroller.__scrollLeft), scroller.__maxScrollLeft);
           this.vBar.state.posValue =  (((scrollTop + outerTop) * 100) / vuescroll.clientHeight);
           this.hBar.state.posValue =  (((scrollLeft + outerLeft) * 100) / vuescroll.clientWidth);    
           if(scroller.__scrollLeft < 0) {
               this.hBar.state.posValue = 0;
           }
           if(scroller.__scrollTop < 0) {
               this.vBar.state.posValue = 0;
           }
           this.vBar.state.size = (heightPercentage < 100) ? (heightPercentage + '%') : 0;
           this.hBar.state.size = (widthPercentage < 100) ? (widthPercentage + '%') : 0;
        }
    }
}