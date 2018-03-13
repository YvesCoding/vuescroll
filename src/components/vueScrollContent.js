
import {
    deepMerge
} from '../util'
// scrollContent
export default  {
    name: 'scrollContent',
    render(_c) {
        let vm = this;
        let style = deepMerge(vm.state.style, {});
        style.height = vm.ops.height;
        if(vm.ops.padding) {
            style[vm.ops.paddPos] =  vm.ops.paddValue;
        }
        return _c(vm.ops.tag, {
            style: style,
            class: "scrollContent",
            props: vm.ops.props,
            attrs: vm.ops.attrs
        }, this.$slots.default);
    },
    props: {
        ops: {
            default() {
                /* istanbul ignore next */
                return {

                }
            }
        },
        state: {
            default() {
                /* istanbul ignore next */
                return {

                }
            }
        }
    }
}