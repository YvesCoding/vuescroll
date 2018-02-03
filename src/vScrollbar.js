

// vertical scrollBar
export default  {
    name: 'vBar',
    computed: {
        computedTop() {
            return this.state.top * 100;
        },
        computedHeight() {
            return this.state.height * 100
        }
    },
    render(_c) {
        var vm = this;
        var style = {
            position: 'absolute',
            top: 0,
            height: vm.computedHeight + '%',
            width: vm.ops.width,
            background: vm.ops.background,
            borderRadius: '4px',
            transform: "translateY(" + vm.computedTop + "%)",
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: vm.state.opacity,
            userSelect: 'none'
        }
        // determine the position
        if (vm.ops.pos == 'right') {
            style['right'] = 0;
        } else {
            style['left'] = 0;
        }

        return _c('div', {
            style: style,
            class: "vScrollbar"
        });
    },
    props: {
        ops: {
            default(){
                /* istanbul ignore next */
                return {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'left',
                    width: '5px'
                } 
            }
        },
        state: {
            default(){
                /* istanbul ignore next */
                return {
                    top: {
                        default: 0
                    },
                    height: {
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