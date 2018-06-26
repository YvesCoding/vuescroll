import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';
/**
 * we won't test push-refresh and
 * push-load here, we will test them in vuescroll.spec.js.
 * we only test the options belong to scrollPanel
 */
describe('scroll-panel', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('initialScrollY and initialScrollX and speed', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 200,
            h: 200
          },
          {
            w: 100,
            h: 100
          }
        ),
        data: {
          ops: {
            scrollPanel: {
              initialScrollY: 10,
              initialScrollX: '20%',
              speed: 1000
            }
          }
        }
      },
      true
    );
    // time = 1000ms spwed + 100ms error
    startSchedule(1100).then(r => {
      const scrollPanel = vm.$el.querySelector('.__panel');
      const { scrollTop, scrollLeft } = scrollPanel;
      expect(scrollTop).toBe(10);
      expect(scrollLeft).toBe(40); // 200 * 0.4
      done();
      r();
    });
  });

  it('scrollingX, scrollingY', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 200,
            h: 200
          },
          {
            w: 100,
            h: 100
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'native'
            },
            scrollPanel: {
              scrollingX: false,
              scrollingY: true
            }
          }
        }
      },
      true
    );
    const scrollPanel = vm.$el.querySelector('.__panel');
    let overX = scrollPanel.style['overflow-x'];
    let overY;
    expect(overX).toBe('hidden');
    vm.ops.scrollPanel.scrollingY = false;
    startSchedule()
      .then(r => {
        overY = scrollPanel.style['overflow-y'];
        expect(overY).toBe('hidden');
        vm.ops.vuescroll.mode = 'pure-native';
        r();
      })
      .then(r => {
        overY = scrollPanel.style['overflow-y'];
        overX = scrollPanel.style['overflow-x'];
        expect(overY).toBe('hidden');
        expect(overX).toBe('hidden');
        r();
        done();
      });
  });
});
