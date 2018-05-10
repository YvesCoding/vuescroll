import { createTest, destroyVM, trigger } from 'test/util';
import bar from 'src/components/child-components/vuescroll-bar';

describe('bar', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });
  // create a bar and test its style
  it('create hBar', () => {
    vm = createTest(bar, {
      ops: {
        pos: 'top',
        height: '6.5px'
      },
      state: {
        size: '20px',
        left: '10',
        opacity: 0.3,
        posValue: 10
      },
      type: 'horizontal'
    }, true);
    const {top, height, width, opacity, transform} = vm.$el.style;
    expect(top).toBe('0px');
    expect(height).toBe('6.5px');
    expect(width).toBe('20px');
    expect(opacity).toBe('0.3');
    expect(transform).toBe('translate3d(10%, 0%, 0px)');
  });

  it('create vBar', () => {
    vm = createTest(bar, {
      ops: {
        pos: 'left',
        width: '6.5px'
      },
      state: {
        size: '20px',
        posValue: '10',
        opacity: 0.3
      },
      type: 'vertical'
    }, true);
    const {left, height, width, opacity, transform} = vm.$el.style;
    expect(left).toBe('0px');
    expect(height).toBe('20px');
    expect(width).toBe('6.5px');
    expect(opacity).toBe('0.3');
    expect(transform).toBe('translate3d(0%, 10%, 0px)');
  });

  // test hover
  it('test bar hover', () => {
    vm = createTest(bar, {
      ops: {
        hover: 'red',
        background: 'blue'
      },
      state: {},
      type: 'vertical'
    }, true);
    trigger(vm.$el, 'mouseenter');
    let background = vm.$el.style.background;
    expect(background).toBe('red');
    trigger(vm.$el, 'mouseleave');
    background = vm.$el.style.background;
    expect(background).toBe('blue');
  });
  
});