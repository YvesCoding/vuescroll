// vueScrollPanel
export default   {
    name: 'scrollPanel',
    render: function(_c) {
        var vm = this;
        return _c('div', {
            style: {
                overflow: 'scroll',
                marginRight: '-17px',
                height: 'calc(100% + 17px)'
            },
            class: "vueScrollPanel",
            on: {
                scroll: function(e) {
                    vm.$emit('scrolling', e);
                },
                wheel: function(e) {
                    vm.$emit('wheeling', e);
                }
            }
        }, this.$slots.default);
    }
}