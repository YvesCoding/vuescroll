export default {
  vertical: {
    bar: {
      size: 'height',
      opsSize: 'width',
      posName: 'top',
      opposName: 'bottom',
      page: 'pageY',
      scroll: 'scrollTop',
      scrollSize: 'scrollHeight',
      offset: 'offsetHeight',
      client: 'clientY'
    },
    axis: 'Y'
  },
  horizontal: {
    bar: {
      size: 'width',
      opsSize: 'height',
      posName: 'left',
      opposName: 'right',
      page: 'pageX',
      scroll: 'scrollLeft',
      scrollSize: 'scrollWidth',
      offset: 'offsetWidth',
      client: 'clientX'
    },
    axis: 'X'
  }
};
