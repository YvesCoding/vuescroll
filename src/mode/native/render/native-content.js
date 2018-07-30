import {
  isSupportGivenStyle,
  insertChildrenIntoSlot,
  getGutter
} from 'shared/util';

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
    }
  };
  return (
    <scrollContent {...scrollContentData}>{[vm.$slots.default]}</scrollContent>
  );
}

export default {
  name: 'scrollContent',
  functional: true,
  props: {
    ops: { type: Object }
  },
  render(h, { props, slots, parent }) {
    let style = {};
    let width = isSupportGivenStyle('width', 'fit-content');
    let gutter = getGutter();
    const _class = ['__view'];

    if (width) {
      style.width = width;
    } /* istanbul ignore next */ else {
      /*
      * fallback to inline block while
      * doesn't support 'fit-content',
      * this may cause some issues, but this
      * can make `resize` event work...
      */
      style['display'] = 'inline-block';
    }

    if (props.ops.padding) {
      style.paddingRight = parent.mergedOptions.rail.size; //props.ops.paddingValue;
    }

    if (gutter) {
      style['margin-bottom'] = -gutter + 'px';
      style['border-right-width'] = 30 - gutter + 'px';
      _class.push('__gutter');
      if (!parent.bar.hBar.state.size) {
        _class.push('__no-hbar');
      }
    }

    const propsData = {
      style,
      ref: 'scrollContent',
      class: _class
    };

    const _customContent = parent.$slots['scroll-content'];
    if (_customContent) {
      return insertChildrenIntoSlot(
        h,
        _customContent,
        slots().default,
        propsData
      );
    }

    return <div {...propsData}>{slots().default}</div>;
  }
};
