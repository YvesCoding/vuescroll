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
            w: 200,
            h: 200
          },
          {
            w: 100,
            h: 100
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
    startSchedule()
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        expect(hBar).not.toBe(null);
        content.style.width = '100px';
        _r = r;
      })
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        expect(hBar).toBe(null);
        content.style.width = '200px';
        _r = r;
      })
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        expect(hBar).not.toBe(null);
        // test slide mode
        vm.ops.vuescroll.mode = 'slide';
        r();
      })
      .then(r => {
        content = vm.$el.querySelector('.vuescroll-panel > div');
        content.style.width = '100px';
        _r = r;
      })
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        expect(hBar).toBe(null);
        content.style.width = '200px';
        _r = r;
      })
      .wait(1)
      .then(r => {
        hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');
        expect(hBar).not.toBe(null);
        r();
        done();
      });
  });
});
