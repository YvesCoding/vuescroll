// import scroller
import Scroller from '../../util/scroller'
import {
    render 
} from '../../util/scroller/render'
import {
    listenContainer
}from '../../util/scroller/listener'

let activateCallback = function() {
    const refreshElem = this.$refs['refreshDom'];
    refreshElem.className += " active";
	refreshElem.innerHTML = "Release to Refresh";
}

let deactivateCallback = function() {
    const refreshElem = this.$refs['refreshDom'];
    refreshElem.className = refreshElem.className.replace(" active", "");
	refreshElem.innerHTML = "Pull to Refresh";
}
let startCallback = function() {
    let vm = this;
    const refreshElem = vm.$refs['refreshDom'];
    refreshElem.className += " running";
    refreshElem.innerHTML = "Refreshing...";
    setTimeout(function() {
        refreshElem.className = refreshElem.className.replace(" running", "");
        vm.scroller.finishPullToRefresh();
    }, 2000);
}
export default {
    methods: {
        updateScroller() {
            const clientWidth = this.$el.clientWidth;
            const clientHeight = this.$el.clientHeight;
            const contentWidth = this.scrollPanelElm.scrollWidth;
            let contentHeight = this.scrollPanelElm.scrollHeight;
            if(this.mergedOptions.vuescroll.refreshHeight) {
                contentHeight -= this.mergedOptions.vuescroll.refreshHeight;
            }
            this.scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
        },
        registryScroller() {
            let zooming = true;
            // disale zooming when refresh enabled
            if(this.mergedOptions.vuescroll.refresh) {
                zooming = false;
            }
            // Initialize Scroller
            this.scroller = new Scroller(render(this.scrollPanelElm, window), {
                zooming,
                animationDuration: this.mergedOptions.scrollPanel.speed
            });
            var rect = this.$el.getBoundingClientRect();
            this.scroller.setPosition(rect.left + this.$el.clientLeft, rect.top + this.$el.clientTop);    
            const cb = listenContainer(this.$el, this.scroller, (eventType) => {
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
            });
            // registry refresh
            if(this.mergedOptions.vuescroll.refresh) {
                const refreshElem = this.$refs['refreshDom'];
                if(this.$listeners.activate) {
                    activateCallback = () => {
                        this.$emit('activate', this);
                    }
                }
                if(this.$listeners.deactivate) {
                    deactivateCallback = () => {
                        this.$emit('deactivate', this);
                    }
                }
                if(this.$listeners.start) {
                    startCallback = () => {
                        this.$emit('start', this);
                    }
                }
                this.scroller.activatePullToRefresh(
                    this.mergedOptions.vuescroll.refreshHeight,
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