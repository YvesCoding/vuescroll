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
            },
            scrollContent: {
              padding: true
            }
          }
        }
      },
      true
    );

    vm.$nextTick(() => {
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
    const vs = vm.$refs['vs'];
    const tipDom = vs.$el.querySelector('.__refresh');
    const { clientHeight } = tipDom;
    trigger(vs.$el, 'mousedown');

    // style
    expect(tipDom.style['margin-top']).toBe(-clientHeight + 'px');

    // deactive
    expect(tipDom.innerText).toBe('refresh deactive tip');
    // active
    // in scroller axis
    // down is nagative
    // up is positivw
    vs.scroller.__publish(
      vs.scroller.__scrollLeft,
      -clientHeight * 2,
      1, // zoom level
      false // animate?
    );
    vs.scroller.__refreshActivate();
    vs.scroller.__refreshActive = true;

    vm.$nextTick(() => {
      expect(tipDom.innerText).toBe('refresh active tip');
      trigger(document, 'mouseup');
      // start
      vs.scroller.triggerRefreshOrLoad('refresh');
      vm.$nextTick(() => {
        expect(tipDom.innerText).toBe('refresh start tip');
        startSchedule(2010)
          .then(r => {
            expect(tipDom.innerText).toBe('refresh before deactive tip');
            r();
          })
          .wait(510)
          .then(() => {
            expect(tipDom.innerText).toBe('refresh deactive tip');
            done();
          });
      });
    });
  });

  // test push load
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
    const tipDom = vs.$el.querySelector('.__load');
    const { clientHeight } = tipDom;
    trigger(vs.$el, 'mousedown');

    // deactive
    expect(tipDom.innerText).toBe('load deactive tip');

    // scroll to bottom first
    vs.scrollTo(
      {
        y: '100%'
      },
      false
    );
    vs.scroller.__publish(
      vs.scroller.__scrollLeft,
      clientHeight * 2,
      1, // zoom level
      false // animate?
    );
    vs.scroller.__loadActivate();
    vs.scroller.__loadActive = true;
    vm.$nextTick(() => {
      expect(tipDom.innerText).toBe('load active tip');
      trigger(document, 'mouseup');
      // start
      vs.scroller.triggerRefreshOrLoad('load');
      vm.$nextTick(() => {
        expect(tipDom.innerText).toBe('load start tip');
        startSchedule(2010)
          .then(r => {
            expect(tipDom.innerText).toBe('load before deactive tip');
            r();
          })
          .wait(510)
          .then(() => {
            expect(tipDom.innerText).toBe('load deactive tip');
            done();
          });
      });
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
      .then(r => {
        vs.scrollTo(
          {
            y: 201
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        // Math.round(201 / 200) * 200 == 200
        expect(vs.scroller.__scrollTop).toBe(200);
        vs.scrollTo(
          {
            y: 300
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        // Math.round(300 / 200) * 200 == 400
        expect(vs.scroller.__scrollTop).toBe(400);
        r();
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
      .then(r => {
        vs.scrollTo(
          {
            y: 51
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        // Math.round(51 / 50) * 50 == 50
        expect(vs.scroller.__scrollTop).toBe(50);
        vs.scrollTo(
          {
            y: 75
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        // Math.round(75 / 50) * 50 == 100
        expect(vs.scroller.__scrollTop).toBe(100);
        r();
        done();
      });
  });

  // hide bar, show bar
  it('hide bar, show bar, keep vBar show', done => {
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
              vBar: {
                keepShow: false
              }
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule(520)
      .then(r => {
        trigger(vs.$el, 'mouseenter');
        r();
      })
      .wait(520)
      .then(r => {
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        let hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(vBar.style.opacity).toBe('1');
        expect(hBar.style.opacity).toBe('1');
        trigger(vs.$el, 'mouseleave');
        r();
      })
      .wait(520)
      .then(r => {
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        let hBar = vm.$el.querySelector('.__bar-is-horizontal');
        expect(vBar.style.opacity).toBe('0');
        expect(hBar.style.opacity).toBe('0');
        vm.ops.bar.vBar.keepShow = true;
        trigger(vs.$el, 'mouseenter');
        trigger(vs.$el, 'mouseleave');
        r();
      })
      .wait(520)
      .then(r => {
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        expect(vBar.style.opacity).toBe('1');
        r();
        done();
      });
  });
});
