import {
  destroyVM,
  createVue,
  makeTemplate,
  trigger,
  startSchedule
} from 'test/unit/util';

describe('scrollbar', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  // hover style
  it('hover style , keep show', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 800,
            h: 800
          },
          {
            w: 400,
            h: 400
          }
        ),
        data: {
          ops: {
            bar: {
              onlyShowBarOnScroll: false,
              keepShow: true,
              background: 'blue',
              hoverStyle: {
                backgroundColor: 'red'
              }
            }
          }
        }
      },
      true
    );

    let vBar = null;
    const vsElm = vm.$refs['vs'].$el;
    startSchedule()
      // Test for hoverStyle
      .then(() => {
        vBar = vm.$el.querySelector('.__bar-is-vertical');
        trigger(vBar, 'mouseenter');
      })
      .then(() => {
        expect(vBar.style.backgroundColor).toBe('red');
        trigger(vBar, 'mouseleave');
      })
      .then(() => {
        expect(vBar.style.background).toBe('blue');
        trigger(vsElm, 'mouseleave');
      })
      // Test for keepShow
      .then(() => {
        expect(vBar.style.opacity).toBe('1');
        vm.ops.bar.keepShow = false;
      })
      .then(() => {
        trigger(vsElm, 'mouseleave');
      })
      .then(() => {
        expect(vBar.style.opacity).toBe('0');
        trigger(vsElm, 'mouseenter');
      })
      .then(() => {
        expect(vBar.style.opacity).toBe('1');
        done();
      });
  });
});
