export default {
    methods: {
        scrollTo(pos) {
            const x = pos.x || this.$refs['scrollPanel'].$el.scrollLeft;
            const y = pos.y || this.$refs['scrollPanel'].$el.scrollTop;
            this.$refs['scrollPanel'].$el.scrollTo(x, y);
        }
    }
}