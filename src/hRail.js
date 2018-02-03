

// horizontal rail
export default   {
    name: 'hRail',
    render(_c) {
        let vm = this;
        let style = {
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
                "click"(e) {
                    vm.$emit('scrollContentByBar', e, 'hScrollbar');
                }
            }
        }, this.$slots.default);
    },
    props: {
        ops: {
            default(){
                /* istanbul ignore next */
                return {
                    
                }
            }
        }
         
    }
}