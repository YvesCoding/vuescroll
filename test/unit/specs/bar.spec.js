import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule,
  trigger
} from 'test/unit/util';

describe('rail and scrollButton', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('vBar and hBar should scroll to middle after clicking the middle of the rail', (done) => {
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
            bar: {
              keepShow: true
            }
          }
        },
        methods: {}
      },
      true
    );
    const vs = vm.$refs['vs'];
    const panelElm = vs.$el.querySelector('.__panel');
    let maxScrollTop;
    let maxScrollLeft;
    startSchedule()
      .then(() => {
        maxScrollTop = panelElm.scrollHeight - panelElm.clientHeight;
        maxScrollLeft = panelElm.scrollWidth - panelElm.clientWidth;

        const vRail = vs.$el.querySelector('.__bar-wrap-is-vertical');
        const offset = vRail.offsetHeight;
        const clientY = vRail.getBoundingClientRect().top + offset / 2;
        trigger(vRail, 'mousedown', { clientY });
      })
      .wait(350)
      .then(() => {
        const styleOfTransform = vs.$el.querySelector('.__bar-is-vertical')
          .style.transform;
        expect(styleOfTransform).toBe('translateY(50%)');
        expect(panelElm.scrollTop).toBe(maxScrollTop / 2);
      })
      .then(() => {
        const hRail = vs.$el.querySelector('.__bar-wrap-is-horizontal');
        const offset = hRail.offsetWidth;
        const clientX = hRail.getBoundingClientRect().left + offset / 2;
        trigger(hRail, 'mousedown', { clientX });
      })
      .wait(350)
      .then(() => {
        const styleOfTransform = vs.$el.querySelector('.__bar-is-horizontal')
          .style.transform;
        expect(styleOfTransform).toBe('translateX(50%)');
        expect(panelElm.scrollLeft).toBe(maxScrollLeft / 2);

        done();
      });
  });

  it('clicking scroll button on the bottom should scroll down 180', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 400
          },
          {
            w: 100,
            h: 100
          }
        ),
        data: {
          ops: {
            scrollButton: {
              enable: true,
              step: 180
            }
          }
        },
        methods: {}
      },
      true
    );
    const vs = vm.$refs['vs'];
    const panelElm = vs.$el.querySelector('.__panel');

    startSchedule()
      .then(() => {
        const scrollButton = vs.$el.querySelector(
          '.__bar-button-is-vertical-end .__bar-button-inner'
        );
        trigger(scrollButton, 'mousedown');
      })
      .wait(350)
      .then(() => {
        expect(panelElm.scrollTop).toBe(vm.ops.scrollButton.step);
        trigger(document, 'mouseup');
        done();
      });
  });

  it('bar size should be 6px and rail size should be 10px', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 400
          },
          {
            w: 100,
            h: 100
          }
        ),
        data: {
          ops: {
            rail: {
              size: '10px'
            },
            bar: {
              size: '6px'
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule().then(() => {
      const hBar = vs.$el.querySelector('.__bar-is-horizontal');
      const hRail = vs.$el.querySelector('.__rail-is-horizontal');
      const vBar = vs.$el.querySelector('.__bar-is-vertical');
      const vRail = vs.$el.querySelector('.__rail-is-vertical');

      expect(hBar.style.height).toBe('6px');
      expect(vBar.style.width).toBe('6px');

      expect(hRail.style.height).toBe('10px');
      expect(vRail.style.width).toBe('10px');

      done();
    });
  });

  it('keep show', (done) => {
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
              background: 'blue'
            }
          }
        }
      },
      true
    );

    let vBar = null;
    const vsElm = vm.$refs['vs'].$el;
    startSchedule()
      .then(() => {
        vBar = vm.$el.querySelector('.__bar-is-vertical');
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

  it('disable bar', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 400
          },
          {
            w: 100,
            h: 100
          }
        ),
        data: {
          ops: {
            bar: {
              disable: true
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule().then(() => {
      const hBar = vs.$el.querySelector('.__bar-is-horizontal');
      const hRail = vs.$el.querySelector('.__rail-is-horizontal');
      const vBar = vs.$el.querySelector('.__bar-is-vertical');
      const vRail = vs.$el.querySelector('.__rail-is-vertical');

      expect(hBar).toBe(null);
      expect(vBar).toBe(null);

      expect(hRail).toBe(null);
      expect(vRail).toBe(null);

      done();
    });
  });
});
