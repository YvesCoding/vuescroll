import {
    goScrolling
}from '../util'

export default {
    methods: {
        scrollTo(pos) {
            const x = pos.x || this.$refs['scrollPanel'].$el.scrollLeft;
            const y = pos.y || this.$refs['scrollPanel'].$el.scrollTop;
            goScrolling(
                this.$refs['scrollPanel'].$el,
                x - this.$refs['scrollPanel'].$el.scrollLeft,
                y - this.$refs['scrollPanel'].$el.scrollTop,
                this.mergedOptions.scrollPanel.speed,
                this.mergedOptions.scrollPanel.easing
            );
        },
        forceUpdate() {
            this.$forceUpdate();
            Object.keys(this.$refs).forEach(ref => {
                this.$refs[ref].$forceUpdate();
            })
        }
    }
}