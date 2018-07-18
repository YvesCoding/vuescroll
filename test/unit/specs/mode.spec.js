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
    startSchedule().then(() => {
      let content = vm.$el.querySelector('.__view');
      let panel = vm.$el.querySelector('.__panel');
      expect(panel).not.toBe(null);
      expect(content).toBe(null);
      done();
    });
  });
});
