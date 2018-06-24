import {
  deepMerge,
  isSupportGivenStyle,
  insertChildrenIntoSlot
} from '../../util';
// scrollContent
export default {
  name: 'scrollContent',
  functional: true,
  props: {
    ops: { type: Object },
    state: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  render(h, { props, slots, parent }) {
    let style = deepMerge(props.state.style, {});
    style.position = 'relative';
    let width = isSupportGivenStyle('width', 'fit-content');
    if (width) {
      style.width = width;
    } /* istanbul ignore next */ else {
      // fallback to inline block while
      // doesn't support 'fit-content',
      // this may cause some issues, but this
      // can make `resize` event work...
      style['display'] = 'inline-block';
    }
    style.boxSizing = 'border-box';
    if (props.ops.padding) {
      style[props.ops.paddPos] = props.ops.paddValue;
    }

    const propsData = {
      style: style,
      ref: 'scrollContent',
      class: 'vuescroll-content'
    };
    const customContent = parent.$slots['scroll-content'];
    if (customContent) {
      return insertChildrenIntoSlot(
        h,
        customContent,
        slots().default,
        propsData
      );
    }
    return <div {...propsData}>{slots().default}</div>;
  }
};

/**
 * create scroll content
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createContent(h, vm) {
  // scrollContent data
  const scrollContentData = {
    props: {
      ops: vm.mergedOptions.scrollContent
    }
  };
  return (
    <scrollContent {...scrollContentData}>{[vm.$slots.default]}</scrollContent>
  );
}
