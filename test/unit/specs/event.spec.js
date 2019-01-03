import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';

let _r = () => {};
const callResize = () => {
  _r();
};

describe('handle-resize', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('toggle mode test resize', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 198,
            h: 198
          },
          {
            w: 99,
            h: 99
          },
          '@handle-resize="handleResize"'
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'native'
            }
          }
        },
        methods: {
          handleResize() {
            callResize();
          }
        }
      },
      true
    );
    let hBar;
    let content = vm.$el.querySelector('.__view > div');
    startSchedule()
      .then((r) => {
        hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(hBar).not.toBe(null);
        content.style.width = '99px';
        _r = r;
      })
      .then((r) => {
        hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(hBar).toBe(null);
        content.style.width = '198px';
        _r = r;
      })
      .then(() => {
        hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(hBar).not.toBe(null);
        // test slide mode
        vm.ops.vuescroll.mode = 'slide';
      })
      .wait(5)
      .then((r) => {
        content = vm.$el.querySelector('.__panel > div');
        content.style.width = '99px';
        _r = r;
      })
      .then((r) => {
        hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(hBar).toBe(null);
        content.style.width = '198px';
        _r = r;
      })
      .then(() => {
        hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(hBar).not.toBe(null);
        done();
      });
  });
});
