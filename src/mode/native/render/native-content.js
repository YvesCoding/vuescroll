import { isSupportGivenStyle, insertChildrenIntoSlot } from 'shared/util';
/**
 * create scroll content
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createContent(h, vm) {
  const scrollContentData = {
    props: {
      ops: vm.mergedOptions.scrollContent
    },
    ref: 'scrollContent'
  };
  return (
    <scrollContent {...scrollContentData}>{[vm.$slots.default]}</scrollContent>
  );
}

export default {
  name: 'scrollContent',
  props: {
    ops: { type: Object }
  },
  render(h) {
    let style = {};
    let width = isSupportGivenStyle('width', 'fit-content');
    const vm = this;
    if (width) {
      style.width = width;
    }

    if (vm.ops.padding) {
      style.paddingRight = vm.$parent.$parent.mergedOptions.rail.size; //props.ops.paddingValue;
    }

    const propsData = {
      style: style,
      ref: 'scrollContent',
      class: '__view'
    };

    const _customContent = vm.$parent.$parent.$slots['scroll-content'];
    if (_customContent) {
      return insertChildrenIntoSlot(
        h,
        _customContent,
        vm.$slots.default,
        propsData
      );
    }

    return <div {...propsData}>{vm.$slots.default}</div>;
  }
};
