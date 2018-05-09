export default {
  vertical: {
    bar: {
      size: 'height',
      opsSize: 'width',
      posName: 'top',
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
      page: 'pageX',
      scroll: 'scrollLeft',
      scrollSize: 'scrollWidth',
      offset: 'offsetWidth',
      client: 'clientX'
    },
    axis: 'X'
  }
};
