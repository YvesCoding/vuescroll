import { createVue, destroyVM } from 'test/unit/util';
import rail from 'src/components/child-components/vuescroll-rail';

describe('rail', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });
  // create a rail and test its style
  it('create hRail', () => {
    vm = createVue(
      {
        template: `
        <rail :ops="ops" :type="type"/>
      `,
        data: {
          ops: {
            pos: 'top',
            height: '6px',
            background: 'red',
            opacity: '0.2'
          },
          type: 'horizontal'
        },
        components: {
          rail
        }
      },
      true
    );
    const { top, height, width, opacity, background } = vm.$el.style;
    expect(top).toBe('0px');
    expect(height).toBe('6px');
    expect(width).toBe('100%');
    expect(opacity).toBe('0.2');
    expect(background).toBe('red');
  });

  // create a rail and test its style
  it('create vRail', () => {
    vm = createVue(
      {
        template: `
        <rail :ops="ops" :type="type"/>
      `,
        data: {
          ops: {
            pos: 'left',
            width: '6px',
            background: 'red',
            opacity: '0.2'
          },
          type: 'vertical'
        },
        components: {
          rail
        }
      },
      true
    );
    const { left, height, width, opacity, background } = vm.$el.style;
    expect(left).toBe('0px');
    expect(width).toBe('6px');
    expect(height).toBe('100%');
    expect(opacity).toBe('0.2');
    expect(background).toBe('red');
  });
});
