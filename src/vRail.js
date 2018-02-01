
// vertical rail
export default  {
    name: 'vRail',
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: '100%',
            width: vm.ops.width,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'vScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops:{
            default: function() {
                /* istanbul ignore next */
                return {
                    width: {
                        default: '5px'
                    },
                    pos: {
                        default: 'left'
                    },
                    background: {
                        default: '#a5d6a7'
                    },
                    opacity: {
                        default: '0.5'
                    }
                }
            }
        } 
    }
}