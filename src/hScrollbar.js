
// horizontal scrollBar
export default  {
    name: 'hBar',
    computed: {
        computedLeft: function() {
            return this.state.left * 100;
        },
        computedWidth: function() {
            return this.state.width * 100
        }
    },
    render: function(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            width: vm.computedWidth + '%',
            height: vm.ops.height,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateX(" + vm.computedLeft + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        }
        // determine the position
        if (vm.ops.pos == 'top') {
            style['top'] = 0;
        } else {
            style['bottom'] = 0;
        }
        return _c('div', {
            style: style,
            class: "hScrollbar"
        });
    },
    props: {
        ops: {
            default: function() {
                /* istanbul ignore next */
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'bottom',
                    height: '5px'
                }   
            }
        },
        state: {
            default: function(){
                /* istanbul ignore next */
                return {
                    left: {
                        default: 0
                    },
                    width: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            }
        }
    }
}