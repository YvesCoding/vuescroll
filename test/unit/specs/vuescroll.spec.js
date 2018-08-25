import {
  destroyVM,
  createVue,
  makeTemplate,
  trigger,
  startSchedule
} from 'test/unit/util';
/**
 * we won't test mode and zooming here,
 * instead, we test it in
 * *-mode.spec.js and api/index.spec.js
 */
describe('vuescroll', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('sizeStrategy', done => {
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
              sizeStrategy: 'number'
            }
          }
        }
      },
      true
    );

    // sizeStrategy
    startSchedule().then(() => {
      const vs = vm.$refs['vs'].$el;
      const _vm = vm.$el;
      const { height, width } = vs.style;
      const { clientWidth, clientHeight } = _vm;
      expect(height).toBe(clientHeight + 'px');
      expect(width).toBe(clientWidth + 'px');
      vm.ops.vuescroll.sizeStrategy = 'percent';
      // use task to make sure that all microtasks run
      startSchedule().then(() => {
        expect(vs.style.width).toBe('100%');
        expect(vs.style.height).toBe('100%');
        done();
      });
    });
  });

  function createMoveFunc(elm, startPoint, nextFramePoint) {
    let start = false;
    function moveTo(number) {
      if (number == -1) {
        trigger(document, 'mouseup');
        start = false;
        return;
      }
      if (!start) {
        start = true;
        trigger(elm, 'mousedown', { clientY: startPoint });
        trigger(document, 'mousemove', { clientY: nextFramePoint });
      }
      trigger(document, 'mousemove', { clientY: number });
    }

    return moveTo;
  }

  // test pull refresh
  it('pull-refresh', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 800
          },
          {
            w: 400,
            h: 200
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              sizeStrategy: 'number',
              pullRefresh: {
                enable: true,
                tips: {
                  deactive: 'refresh deactive tip',
                  active: 'refresh active tip',
                  start: 'refresh start tip',
                  beforeDeactive: 'refresh before deactive tip'
                }
              }
            }
          }
        }
      },
      true
    );

    // load
    const vs = vm.$refs['vs'];
    let tipDom;
    const moveY = createMoveFunc(vs.$el, 0, 50);
    startSchedule()
      .then(() => {
        tipDom = vs.$el.querySelector('.__refresh');
        // Current is at the deactive stage.
        expect(tipDom.innerText).toBe('refresh deactive tip');
        moveY(200);
      })
      .then(() => {
        expect(tipDom.innerText).toBe('refresh active tip');
        moveY(-1);
      })
      .wait(10)
      .then(() => {
        expect(tipDom.innerText).toBe('refresh start tip');
      })
      .wait(2400)
      .then(() => {
        expect(tipDom.innerText).toBe('refresh before deactive tip');
        done();
      });
  });

  it('push-load', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 800
          },
          {
            w: 400,
            h: 200
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              sizeStrategy: 'number',
              pushLoad: {
                enable: true,
                tips: {
                  deactive: 'load deactive tip',
                  active: 'load active tip',
                  start: 'load start tip',
                  beforeDeactive: 'load before deactive tip'
                }
              }
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    const moveY = createMoveFunc(vs.$el, 300, 290);
    let tipDom;

    startSchedule()
      .wait(100)
      .then(() => {
        vs.scrollTo({ y: '100%' });
      })
      .wait(500)
      .then(() => {
        tipDom = vs.$el.querySelector('.__load');
        // Current is at the deactive stage.
        expect(tipDom.innerText).toBe('load deactive tip');
        moveY(150);
      })
      .then(() => {
        expect(tipDom.innerText).toBe('load active tip');
        moveY(-1);
      })
      .wait(10)
      .then(() => {
        expect(tipDom.innerText).toBe('load start tip');
      })
      .wait(2400)
      .then(() => {
        expect(tipDom.innerText).toBe('load before deactive tip');
        done();
      });
  });

  // The measures of calculation of paging and snapping
  // paging:
  // Math.round(scrollTop / clientHeight) * clientHeight
  // snapping:
  // Math.round(scrollTop / snapHeight) * snapHeight
  it('paging', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 800
          },
          {
            w: 400,
            h: 200
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              paging: true
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];

    startSchedule()
      .then(() => {
        vs.scrollTo(
          {
            y: 201
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        // Math.round(201 / 200) * 200 == 200
        expect(vs.scroller.__scrollTop).toBe(200);
        vs.scrollTo(
          {
            y: 300
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        // Math.round(300 / 200) * 200 == 400
        expect(vs.scroller.__scrollTop).toBe(400);
        done();
      });
  });

  // snapping
  it('snapping', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 800
          },
          {
            w: 400,
            h: 200
          }
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              snapping: {
                enable: true,
                height: 50
              }
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];

    startSchedule()
      .then(() => {
        vs.scrollTo(
          {
            y: 51
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        // Math.round(51 / 50) * 50 == 50
        expect(vs.scroller.__scrollTop).toBe(50);
        vs.scrollTo(
          {
            y: 75
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        // Math.round(75 / 50) * 50 == 100
        expect(vs.scroller.__scrollTop).toBe(100);
        done();
      });
  });

  // detectResize
  it('detectResize', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 400,
            h: 800
          },
          {
            w: 400,
            h: 200
          }
        ),
        data: {
          ops: {
            vuescroll: {
              detectResize: false
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];

    startSchedule()
      .then(() => {
        const object = vs.$el.querySelector('object');
        expect(object).toBe(null);

        vm.ops.vuescroll.detectResize = true;
      })
      .then(() => {
        const object = vs.$el.querySelector('object');
        expect(object).not.toBe(null);

        done();
      });
  });
});
