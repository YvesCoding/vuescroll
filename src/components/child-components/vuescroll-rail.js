import map from '../../shared/scroll-map';

export default {
  name: 'rail',
  functional: true,
  render(h, { props }) {
    const bar = map[props.type].bar;

    let style = {
      [bar.posName]: 0,
      [props.ops.pos]: 0,
      [bar.size]: '100%',
      [bar.opsSize]: props.ops[bar.opsSize],
      borderRadius: props.ops[bar.opsSize],
      background: props.ops.background,
      opacity: props.ops.opacity,
      position: 'absolute'
    };
    let data = {
      style: style,
      class: `vuescroll-${props.type}-rail`,
      ref: `${props.type}Rail`
    };
    return <div {...data}> </div>;
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
  const railType = type === 'vertical' ? 'vRail' : 'hRail';
  const barType = type === 'vertical' ? 'vBar' : 'hBar';
  const axis = type === 'vertical' ? 'Y' : 'X';

  const railData = {
    props: {
      type: type,
      ops: vm.mergedOptions.rail[railType],
      state: vm.rail[railType].state
    }
  };
  if (
    !vm.bar[barType].state.size ||
    vm.mode == 'pure-native' ||
    !vm.mergedOptions.scrollPanel['scrolling' + axis] ||
    (vm.refreshLoad && type !== 'vertical' && vm.mode === 'slide')
  ) {
    return null;
  }
  return <rail {...railData} />;
}
