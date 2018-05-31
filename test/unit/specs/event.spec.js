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

  it('toggle mode test resize', done => {
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
    let content = vm.$el.querySelector('.vuescroll-content > div');
    startSchedule(10)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');
        expect(hBar).not.toBe(null);
        content.style.width = '99px';
        _r = r;
      })
      .wait(1)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');
        expect(hBar).toBe(null);
        content.style.width = '198px';
        _r = r;
      })
      .wait(1)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');
        expect(hBar).not.toBe(null);
        // test slide mode
        vm.ops.vuescroll.mode = 'slide';
        r();
      })
      .wait(1)
      .then(r => {
        content = vm.$el.querySelector('.vuescroll-panel > div');
        content.style.width = '99px';
        _r = r;
      })
      .wait(1)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');
        expect(hBar).toBe(null);
        content.style.width = '198px';
        _r = r;
      })
      .wait(1)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');
        expect(hBar).not.toBe(null);
        r();
        done();
      });
  });
});
