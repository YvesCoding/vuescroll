import {
  isSupportGivenStyle,
  insertChildrenIntoSlot,
  getGutter
} from 'shared/util';
import { BORDER_RIGHT_WIDTH } from 'shared/constants';
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
      const noHbar =
        !parent.bar.hBar.state.size ||
        !parent.mergedOptions.scrollPanel.scrollingX;
      _class.push('__gutter');

      const isVbar =
        parent.bar.vBar.state.size &&
        parent.mergedOptions.scrollPanel.scrollingX;

      if (noHbar) {
        if (!parent.mergedOptions.scrollPanel.scrollingX) {
          _class.push('__no-hbar');
        } else {
          if (isVbar) {
            style['min-width'] = `calc(100% - ${BORDER_RIGHT_WIDTH -
              gutter}px)`;
          } else {
            style['min-width'] = `calc(100% - ${BORDER_RIGHT_WIDTH}px)`;
          }
        }
      }

      if (isVbar) {
        style['border-right-width'] = BORDER_RIGHT_WIDTH - gutter + 'px';
      }
    } /* istanbul ignore next */ else {
      _class.push('__no-hbar');
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
