import scrollMap from './scrollMap'
import {
    renderTransform,
    on,
    off
} from './util'

export default {
    name: "bar",
    computed: {
        bar() {
            return scrollMap[this.type].bar
        }
    },
    render(h) {
            let style = {
            position: 'absolute',
            [vm.ops.pos]: 0,
            [this.bar.size]: this.state.size,
            [this.bar.opsSize]: this.ops.size,
            background: this.ops.background,
            borderRadius: '4px',
            transition: 'opacity .5s',
            cursor: 'pointer',
            opacity: this.state.opacity,
            userSelect: 'none'
        }
        const data = {
            style: style,
            class: `${this.type}Scrollbar`
        }
        return (
            <div
                style={renderTransform(this.type, this.state.posValue)}
                onMousedown={this.handleMousedown}
                {...data}
            >
            </div>
        );
    },
    methods: {
        handleMousedown(e) {
            this[scrollMap[this.type].axis] = e[`page${scrollMap[this.type].axis}`];
            this.$emit("update:")
        },
        handleMouseMove(e) {

        }
    },
    props: {
        ops: {
            type: Object,
            required: true
        },
        state: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }
}