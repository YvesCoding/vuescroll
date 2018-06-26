import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';

describe('mode', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('toggle mode', done => {
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
            }
          }
        }
      },
      true
    );

    let content = vm.$el.querySelector('.__view');
    let panel = vm.$el.querySelector('.__panel');
    expect(content).not.toBe(null);
    expect(content.parentNode).toEqual(panel);
    vm.ops.vuescroll.mode = 'slide';
    startSchedule()
      .wait(1)
      .then(r => {
        let content = vm.$el.querySelector('.__view');
        let panel = vm.$el.querySelector('.__panel');
        expect(panel).not.toBe(null);
        expect(content).toBe(null);
        vm.ops.vuescroll.mode = 'pure-native';
        r();
      })
      .wait(1)
      .then(r => {
        let content = vm.$el.querySelector('.__view');
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        let hBar = vm.$el.querySelector('.__bar-is-horizontal');
        let vRail = vm.$el.querySelector('.__rail-is-vertical');
        let hRail = vm.$el.querySelector('.__rail-is-horizontal');

        let panel = vm.$el.querySelector('.__panel');

        expect(content).toBe(null);
        expect(vBar).toBe(null);
        expect(hBar).toBe(null);
        expect(vRail).toBe(null);
        expect(hRail).toBe(null);

        expect(panel).not.toBe(null);

        r();
        done();
      });
  });
});
