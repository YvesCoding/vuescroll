import map from "../../config/scroll-map";

function handleClickTrack(e, bar, parentRef, type, parent) {
  const client = bar.client;
  const barOffset = parentRef[`${type}Bar`].$el[bar.offset];
  const percent = (e[client] - e.target.getBoundingClientRect()[bar.posName] - barOffset/2) / e.target[bar.offset];
  const pos = parentRef["scrollPanel"].$el[bar.scrollSize] * percent; 
  parent.scrollTo({
    [map[type].axis.toLowerCase()]: pos
  });
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
      [bar.size]: "100%",
      [bar.opsSize]: props.ops[bar.opsSize],
      background: props.ops.background,
      opacity: props.ops.opacity,
      position: "absolute",
      cursor: "pointer",
      borderRadius: "4px"
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
    };
    return (
      <div
        {...data}
      >
      </div>
    );
  }
};

export /**
* create rails
* 
* @param {any} size 
* @param {any} type 
* @param {any} vm 
* @returns 
*/
function createRail(h, vm, type) {
  // rail data
  const railOptionType = type === "vertical"? "vRail": "hRail";
  const barOptionType = type === "vertical"? "vBar": "hBar";
  const axis = type === "vertical"? "Y": "X";

  const railData = {
    props: {
      type: type,
      ops: vm.mergedOptions[railOptionType],
      state: vm[railOptionType].state
    }
  };
  if(!vm[barOptionType].state.size
   || !vm.mergedOptions.scrollPanel["scrolling" + axis]
   || vm.mergedOptions[railOptionType].disabled
   || (vm.refreshLoad && type !== "vertical" && vm.mode === "slide")) {
    return null;
  }
  return (
    <rail 
      {...railData}
    />
  );

}