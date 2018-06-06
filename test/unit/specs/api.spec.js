import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';
import { vuescroll as _vs } from '../util';
describe('api', () => {
  let vm;

  afterEach(() => {
    if (Array.isArray(vm)) {
      vm.forEach(v => {
        destroyVM(v);
      });
    } else {
      destroyVM(vm);
    }
  });

  it('scrollTo', done => {
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
          ops: {}
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    // scroll Y axis

    startSchedule()
      .then(r => {
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
        const scrollPanel = vm.$el.querySelector('.vuescroll-panel');
        const { scrollTop } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: 300
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        const scrollPanel = vm.$el.querySelector('.vuescroll-panel');
        const { scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollLeft)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: -200
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        const scrollPanel = vm.$el.querySelector('.vuescroll-panel');
        const { scrollLeft } = scrollPanel;
        expect(scrollLeft).toBe(0);
        r();
        done();
      });
  });

  it('scrollBy', done => {
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
          ops: {}
        }
      },
      true
    );
    const vs = vm.$refs['vs'];

    startSchedule()
      .then(r => {
        vs.scrollBy(
          {
            dy: 50,
            dx: 50
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        const scrollPanel = vm.$el.querySelector('.vuescroll-panel');
        const { scrollTop, scrollLeft } = scrollPanel;

        expect(scrollTop).toBe(50);
        expect(scrollLeft).toBe(50);
        r();
        done();
      });
  });

  it('zoomBy, zoomTo', done => {
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
              mode: 'slide'
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'];

    startSchedule()
      .then(r => {
        vs.zoomBy(
          0.5, // factor self.__zoomLevel = self.__zoomLevel * factor
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        let vBar = vm.$el.querySelector('.vuescroll-vertical-bar');
        let hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');

        expect(vBar).toBe(null);
        expect(hBar).toBe(null);
        vs.zoomBy(
          2, // factor self.__zoomLevel = self.__zoomLevel * factor
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        let vBar = vm.$el.querySelector('.vuescroll-vertical-bar');
        let hBar = vm.$el.querySelector('.vuescroll-horizontal-bar');

        expect(vBar).not.toBe(null);
        expect(hBar).not.toBe(null);
        vs.zoomTo(2, true); // now level 1 * 2 = 2;
        r();
      })
      .wait(350)
      .then(r => {
        let { clientHeight } = vm.$el.querySelector('.vuescroll-vertical-bar');
        let { clientWidth } = vm.$el.querySelector('.vuescroll-horizontal-bar');

        expect(clientHeight).toBe(24); // (100 - 4 bar-wrap: top:2px bottom: 2px) / 2 / 2
        expect(clientWidth).toBe(24); // (100 - 4) / 2 / 2
        r();
        done();
      });
  });

  it('triggerRefreshOrLoad, goToPage ', done => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 100,
            h: 100
          },
          {
            w: 100,
            h: 100
          },
          '',
          3
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              paging: true,
              pullRefresh: {
                enable: false
              },
              pushLoad: {
                enable: false
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
        vs.goToPage(
          {
            y: 2
          },
          true
        );
        r();
      })
      .wait(350)
      .then(r => {
        const divs = vm.$el.querySelectorAll('.vuescroll-panel div');
        const currentDom = vs.getCurrentviewDom();
        const page = vs.getCurrentPage();
        expect(page.y).toBe(2);
        expect(currentDom.length).toBe(1);
        expect(currentDom[0]).toEqual(divs[1]);
        vs.scrollIntoView('#d3');
        r();
      })
      .wait(350)
      .then(r => {
        const currentDom = vs.getCurrentviewDom();
        expect(currentDom[0].id).toBe('d3');
        vm.ops.vuescroll.paging = false;
        vm.ops.vuescroll.pullRefresh.enable = true;
        vm.ops.vuescroll.pushLoad.enable = true;
        r();
      })
      .wait(1)
      .then(r => {
        vs.triggerRefreshOrLoad('refresh');
        r();
      })
      .wait(350)
      .then(r => {
        const refreshDom = vs.$el.querySelector('.vuescroll-refresh');
        expect(refreshDom.innerText).toBe('Refreshing...');
        r();
      })
      .wait(2550)
      .then(r => {
        vs.triggerRefreshOrLoad('load');
        r();
      })
      .wait(350)
      .then(r => {
        const loadDom = vs.$el.querySelector('.vuescroll-load');
        expect(loadDom.innerText).toBe('Loading...');
        r();
        done();
      });
  });

  it('refresh, refreshAll', done => {
    vm = [];
    vm[0] = createVue(
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
          'style="display:none"',
          3
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              paging: true,
              pullRefresh: {
                enable: false
              },
              pushLoad: {
                enable: false
              }
            }
          }
        }
      },
      true
    );
    vm[1] = createVue(
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
          'style="display:none"',
          3
        ),
        data: {
          ops: {
            vuescroll: {
              mode: 'slide',
              paging: true,
              pullRefresh: {
                enable: false
              },
              pushLoad: {
                enable: false
              }
            }
          }
        }
      },
      true
    );
    // create two instances to test refreshAll api
    const vs0 = vm[0].$refs['vs'];
    const vs1 = vm[1].$refs['vs'];

    startSchedule()
      .then(r => {
        let vs = document.querySelector('.vuescroll');
        expect(vs).toBe(null);
        vs0.$el.style.display = 'block';
        vs1.$el.style.display = 'block';
        r();
      })
      .then(r => {
        let vs = document.querySelectorAll('.vue-scroll');
        expect(vs.length).toBe(2);
        let hRails = document.querySelector('.vuescroll-horizontal-rail');
        let vRails = document.querySelector('.vuescroll-vertical-rail');
        expect(hRails).toBe(null);
        expect(vRails).toBe(null);
        vs0.refresh();
        r();
      })
      .then(r => {
        let hRail = vs0.$el.querySelector('.vuescroll-horizontal-rail');
        expect(hRail).not.toBe(null);
        _vs.refreshAll();
        r();
      })
      .then(r => {
        let hRail = vs1.$el.querySelector('.vuescroll-horizontal-rail');
        expect(hRail).not.toBe(null);
        done();
        r();
      });
  });
});
