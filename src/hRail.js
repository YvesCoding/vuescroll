

// horizontal rail
export default   {
    name: 'hRail',
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            height: vm.ops.height,
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            borderRadius: '4px'
        };
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }

        return _c('div', {
            style: style,
            on: {
                "click": function(e) {
                    vm.$emit('scrollContentByBar', e, 'hScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops: {
            default: function(){
                /* istanbul ignore next */
                return {
                    height: {
                        default: '5px'
                    },
                    pos: {
                        default: 'bottom'
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