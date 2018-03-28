import map from '../config/scrollMap'

function handleClickTrack(e, bar, parentRef, type, parent) {
    const page = bar.page;
    const barOffset = parentRef[`${type}Bar`].$el[bar.offset];
    const percent = (e[page] - e.target.getBoundingClientRect()[bar.posName] - barOffset/2) / e.target[bar.offset];
    const pos = parentRef['scrollPanel'].$el[bar.scrollSize] * percent; 
    parent.scrollTo({
        [map[type].axis.toLowerCase()]: pos
    })
}

export default {
    name: "rail",
    functional: true,
    render(h, {parent, props}) {
        const bar = map[props.type].bar;
        const parentRef = parent.$refs;
        let style = {
            [bar.posName]: 0,
            [props.ops.pos]: 0,
            [bar.size]: '100%',
            [bar.opsSize]: props.ops[bar.opsSize],
            background: props.ops.background,
            opacity: props.ops.opacity,
            position: 'absolute',
            cursor: 'pointer',
            borderRadius: '4px'
        };
        let data = {
            style: style,
            class: `vuescroll-${props.type}-rail`,
            ref: `${props.type}Rail`,
            on: {
                click(e) {
                    handleClickTrack(
                        e,
                        bar,
                        parentRef,
                        props.type,
                        parent
                    );
                }
            }
        }
        return (
            <div
                {...data}
            >
            </div>
        );
    }
}