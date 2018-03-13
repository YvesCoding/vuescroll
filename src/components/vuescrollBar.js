import scrollMap from '../config/scrollMap'
import {
    renderTransform,
    on,
    off
} from '../util'

export default {
    name: "bar",
    computed: {
        bar() {
            return scrollMap[this.type].bar
        },
        parent() {
            /* istanbul ignore next */
            return this.$parent.$refs
        }
    },
    render(h) {
            let style = {
            [this.bar.posName]: 0,
            [this.ops.pos]: 0,
            [this.bar.size]: this.state.size,
            [this.bar.opsSize]: this.ops[this.bar.opsSize],
            background: this.ops.background,
            opacity: this.state.opacity,
            cursor: 'pointer',
            position: 'absolute',
            borderRadius: '4px',
            transition: 'opacity .5s',
            cursor: 'pointer',
            userSelect: 'none',
            ...renderTransform(this.type, this.state.posValue)
        }
        const data = {
            style: style,
            class: `${this.type}Scrollbar`,
            on: {
                mousedown: this.handleMousedown 
            }
        }
        return (
            <div
                {...data}
            >
            </div>
        );
    },
    methods: {
        handleMousedown(e) {
            e.stopPropagation();
            this.axisStartPos = e[this.bar.client] - this.$el.getBoundingClientRect()[this.bar.posName];
            // tell parent that the mouse has been down.
            this.$emit("setMousedown", true);
            on(document, 'mousemove', this.handleMouseMove);
            on(document, 'mouseup', this.handleMouseUp);
        },
        handleMouseMove(e) {
            /**
             * I really don't have an
             * idea to test mousemove...
             */
            
            /* istanbul ignore next */
            if(!this.axisStartPos ) {
                return;
            }
            /* istanbul ignore next */
            {
                const delta = e[this.bar.client] - this.parent[`${this.type}Rail`].$el.getBoundingClientRect()[this.bar.posName];
                const percent = (delta-this.axisStartPos) / this.parent[`${this.type}Rail`].$el[this.bar.offset];
                this.parent['scrollPanel'].$el[this.bar.scroll] = this.parent['scrollPanel'].$el[this.bar.scrollSize] * percent; 
            } 
        },
        handleMouseUp() {
            this.$emit("setMousedown", false);
            this.$parent.hideBar();
            this.axisStartPos = 0;
            off(document, 'mousemove', this.handleMouseMove);
            off(document, 'mouseup', this.handleMouseUp);
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