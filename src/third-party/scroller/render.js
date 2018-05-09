/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
export function render(content, global, suffix, value) {
  var docStyle = document.documentElement.style;
  var x = null;
  var y = null;
  var engine;
  if (
    global.opera &&
    Object.prototype.toString.call(opera) === '[object Opera]'
  ) {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator.cpuClass === 'string') {
    engine = 'trident';
  }

  if (typeof content == 'string') {
    y = content == 'vertical' ? (x = 0) || value : (x = value) && 0;
  }

  var vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];

  var helperElem = document.createElement('div');
  var undef;

  var perspectiveProperty = vendorPrefix + 'Perspective';
  var transformProperty = vendorPrefix + 'Transform';

  if (helperElem.style[perspectiveProperty] !== undef) {
    if (typeof content == 'string') {
      return {
        [transformProperty]:
          'translate3d(' + x + suffix + ',' + y + suffix + ',0)'
      };
    }
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
    if (typeof content == 'string') {
      return {
        [transformProperty]: 'translate(' + x + suffix + ',' + y + suffix + ')'
      };
    }
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
