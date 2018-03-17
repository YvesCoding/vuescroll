import map from '../config/scrollMap'
export default {
    name: "rail",
    computed: {
        bar() {
            return map[this.type].bar
        },
        parentRef() {
            return this.$parent.$refs;
        }
    },
    methods: {
        handleClickTrack(e) {
            const page = this.bar.page;
            const barOffset = this.parentRef[`${this.type}Bar`].$el[this.bar.offset];
            const percent = (e[page] - e.target.getBoundingClientRect()[this.bar.posName] - barOffset/2) / e.target[this.bar.offset];
            const pos = this.parentRef['scrollPanel'].$el[this.bar.scrollSize] * percent; 
            this.$parent.scrollTo({
                [map[this.type].axis.toLowerCase()]: pos
            })
        }
    },
    render(h) {
        let vm = this;
        let style = {
            [vm.bar.posName]: 0,
            [vm.ops.pos]: 0,
            [vm.bar.size]: '100%',
            [vm.bar.opsSize]: vm.ops[vm.bar.opsSize],
            background: vm.ops.background,
            opacity: vm.ops.opacity,
            position: 'absolute',
            cursor: 'pointer',
            borderRadius: '4px'
        };
        let data = {
            style: style,
            class: `${this.type}Rail`,
            on: {
                click: this.handleClickTrack
            }
        }
        return (
            <div
                {...data}
            >
            </div>
        );
    },
    props: {
        type: {
            required: true,
            type: String
        },
        ops: {
            required: true,
            type: Object
        },
        state: {
            required: true,
            type: Object
        }
    }
}