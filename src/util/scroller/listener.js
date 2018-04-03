export function listenContainer(container, scroller) {
    if(container.isListened) {
        return
    }
    container.isListened = true;
    if ('ontouchstart' in window) {

        container.addEventListener("touchstart", function(e) {
            // Don't react if initial down happens on a form element
            if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                return;
            }
    
            scroller.doTouchStart(e.touches, e.timeStamp);
            e.preventDefault();
        }, false);
    
        document.addEventListener("touchmove", function(e) {
            scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
        }, false);
    
        document.addEventListener("touchend", function(e) {
            scroller.doTouchEnd(e.timeStamp);
        }, false);
    
        document.addEventListener("touchcancel", function(e) {
            scroller.doTouchEnd(e.timeStamp);
        }, false);
    
    } else {
    
        var mousedown = false;
    
        container.addEventListener("mousedown", function(e) {
            if (e.target.tagName.match(/input|textarea|select/i)) {
                return;
            }
            console.log('start');
            scroller.doTouchStart([{
                pageX: e.pageX,
                pageY: e.pageY
            }], e.timeStamp);
    
            mousedown = true;
        }, false);
    
        document.addEventListener("mousemove", function(e) {
            if (!mousedown) {
                return;
            }
            console.log('mousemove');
            scroller.doTouchMove([{
                pageX: e.pageX,
                pageY: e.pageY
            }], e.timeStamp);
    
            mousedown = true;
        }, false);
    
        document.addEventListener("mouseup", function(e) {
            if (!mousedown) {
                return;
            }
            
            scroller.doTouchEnd(e.timeStamp);
    
            mousedown = false;
        }, false);
    
        // container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
        //     scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
        // }, false);
    
    }
}