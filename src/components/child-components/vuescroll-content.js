import { deepMerge } from '../../util';
import { getPrefix } from '../../third-party/scroller/render';
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
  render(h, { props, slots }) {
    let style = deepMerge(props.state.style, {});
    style.position = 'relative';
    const widthStyle = `-${getPrefix(window)}-fit-content`;
    const elm = document.createElement('div');
    elm.style.width = widthStyle;
    if (elm.style.width == widthStyle) {
      style.width = widthStyle;
    } /* istanbul ignore next */ else {
      style.display = 'inline-block';
    }
    style.boxSizing = 'border-box';
    if (props.ops.padding) {
      style[props.ops.paddPos] = props.ops.paddValue;
    }
    return h(
      props.ops.tag,
      {
        style: style,
        ref: 'scrollContent',
        class: 'vuescroll-content',
        props: props.ops.props,
        attrs: props.ops.attrs
      },
      slots().default
    );
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
