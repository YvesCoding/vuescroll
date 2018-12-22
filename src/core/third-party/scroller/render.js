import { getPrefix } from 'shared/util';

/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
export function render(content, global, suffix, type) {
  if (type == 'position') {
    return function(left, top) {
      content.style.left = -left + 'px';
      content.style.top = -top + 'px';
    };
  }

  var vendorPrefix = getPrefix(global);

  var helperElem = document.createElement('div');
  var undef;

  var perspectiveProperty = vendorPrefix + 'Perspective';
  var transformProperty = 'transform'; //vendorPrefix + 'Transform';

  if (helperElem.style[perspectiveProperty] !== undef) {
    return function(left, top, zoom) {
      content.style[transformProperty] =
        'translate3d(' +
        -left +
        suffix +
        ',' +
        -top +
        suffix +
        ',0) scale(' +
        zoom +
        ')';
    };
  } else if (helperElem.style[transformProperty] !== undef) {
    return function(left, top, zoom) {
      content.style[transformProperty] =
        'translate(' +
        -left +
        suffix +
        ',' +
        -top +
        suffix +
        ') scale(' +
        zoom +
        ')';
    };
  }
}
