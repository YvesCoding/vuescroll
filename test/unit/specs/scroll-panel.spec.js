import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';

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
              initialScrollY: '20%',
              initialScrollX: 10,
              speed: 1000
            }
          }
        }
      },
      true
    );
    // time = 1000ms spwed + 100ms error
    startSchedule(1100).then(() => {
      const scrollPanel = vm.$el.querySelector('.__panel');
      const { scrollTop, scrollLeft, scrollHeight, clientHeight } = scrollPanel;
      expect(scrollLeft).toBe(10);
      expect(scrollTop).toBe(Math.floor((scrollHeight - clientHeight) * 0.2));
      done();
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
    startSchedule().then(() => {
      overY = scrollPanel.style['overflow-y'];
      expect(overY).toBe('hidden');
      done();
    });
  });

  // hover style
  it('Padding', done => {
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
            vuescroll: {
              mode: 'native'
            },
            rail: {
              size: '10px'
            },
            scrollPanel: {
              padding: true
            }
          }
        }
      },
      true
    );

    const vsElm = vm.$refs['vs'].$el;
    startSchedule()
      .then(() => {
        const contentElm = vsElm.querySelector('.__view');
        expect(contentElm.style.paddingRight).toBe('10px');
        vm.ops.vuescroll.mode = 'slide';
      })
      .then(() => {
        const contentElm = vsElm.querySelector('.__panel');
        expect(contentElm.style.paddingRight).toBe('10px');
        done();
      });
  });

  it('maxWidth, maxHeight', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 50,
            h: 50
          },
          {
            w: 1000,
            h: 1000
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'native'
            },
            scrollPanel: {
              maxWidth: 100,
              maxHeight: 100
            }
          }
        }
      },
      true
    );

    const vs = vm.$refs['vs'];
    let content;
    startSchedule()
      .then(() => {
        content = vm.$el.querySelector('.__view > div');
        const hBar = vs.$el.querySelector('.__bar-is-horizontal');
        const vBar = vs.$el.querySelector('.__bar-is-vertical');
        expect(hBar).toBe(null);
        expect(vBar).toBe(null);

        content.style.width = '101px';
        content.style.height = '101px';
      })
      .wait(100)
      .then(() => {
        const hBar = vs.$el.querySelector('.__bar-is-horizontal');
        const vBar = vs.$el.querySelector('.__bar-is-vertical');
        expect(hBar).not.toBe(null);
        expect(vBar).not.toBe(null);

        done();
      });
  });
});
