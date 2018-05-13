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
    // In native mode
    // 1. we can't see native scrollbar
    // 2. The closet dom that wraps content
    // is the vuescroll-content
    // but I don't know how to test
    // whether native scrollbar is visible or not.
    let content = vm.$el.querySelector('.vuescroll-content');
    let panel = vm.$el.querySelector('.vuescroll-panel');
    expect(content).not.toBe(null);
    expect(content.parentNode).toEqual(panel);
    vm.ops.vuescroll.mode = 'slide';
    startSchedule()
      .then(r => {
        let content = vm.$el.querySelector('.vuescroll-content');
        let panel = vm.$el.querySelector('.vuescroll-panel');
        expect(panel).not.toBe(null);
        expect(content).toBe(null);
        vm.ops.vuescroll.mode = 'pure-native';
        r();
      })
      .then(r => {
        let content = vm.$el.querySelector('.vuescroll-content');
        let vBar = vm.$el.querySelector('.vuescroll-vertical-scrollbar');
        let hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        let vRail = vm.$el.querySelector('.vuescroll-vertical-rail');
        let hRail = vm.$el.querySelector('.vuescroll-horizontal-rail');

        let panel = vm.$el.querySelector('.vuescroll-panel');

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
