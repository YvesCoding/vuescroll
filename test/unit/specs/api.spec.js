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

  it('scrollTo(native)', done => {
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
    const vs = vm.$refs['vs'];
    // scroll Y axis

    startSchedule()
      .then(() => {
        vs.scrollTo(
          {
            y: 300
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: 300
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollLeft)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: -200
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollLeft } = scrollPanel;
        expect(scrollLeft).toBe(0);
        done();
      });
  });

  it('scrollTo(slide)', done => {
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
    // scroll Y axis

    startSchedule()
      .then(() => {
        vs.scrollTo(
          {
            y: 300
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const { __scrollTop } = vs.scroller;
        expect(Math.ceil(__scrollTop)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: 300
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const { __scrollLeft } = vs.scroller;
        expect(Math.ceil(__scrollLeft)).toBe(100);
        // scroll X axis
        vs.scrollTo(
          {
            x: -200
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const { __scrollLeft } = vs.scroller;
        expect(__scrollLeft).toBe(0);
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
      .then(() => {
        vs.scrollBy(
          {
            dy: 50,
            dx: 50
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;

        expect(scrollTop).toBe(50);
        expect(scrollLeft).toBe(50);
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
      .then(() => {
        vs.zoomBy(
          0.5, // factor self.__zoomLevel = self.__zoomLevel * factor
          true
        );
      })
      .wait(350)
      .then(() => {
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        let hBar = vm.$el.querySelector('.__bar-is-horizontal');

        expect(vBar).toBe(null);
        expect(hBar).toBe(null);
        vs.zoomBy(
          2, // factor self.__zoomLevel = self.__zoomLevel * factor
          true
        );
      })
      .wait(350)
      .then(() => {
        let vBar = vm.$el.querySelector('.__bar-is-vertical');
        let hBar = vm.$el.querySelector('.__bar-is-horizontal');

        expect(vBar).not.toBe(null);
        expect(hBar).not.toBe(null);
        vs.zoomTo(2, true); // now level 1 * 2 = 2;
      })
      .wait(350)
      .then(() => {
        let { clientHeight } = vm.$el.querySelector('.__bar-is-vertical');
        let { clientWidth } = vm.$el.querySelector('.__bar-is-horizontal');

        expect(clientHeight).toBe(24); // (100 - 4 bar-wrap: top:2px bottom: 2px) / 2 / 2
        expect(clientWidth).toBe(24); // (100 - 4) / 2 / 2
        done();
      });
  });

  it('triggerRefreshOrLoad, goToPage ,getCurrentviewDom', done => {
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
      .then(() => {
        vs.goToPage(
          {
            y: 2
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const divs = vm.$el.querySelectorAll('.__panel div');
        const currentDom = vs.getCurrentviewDom();
        const page = vs.getCurrentPage();
        expect(page.y).toBe(2);
        expect(currentDom.length).toBe(1);
        expect(currentDom[0]).toEqual(divs[1]);
        vm.ops.vuescroll.mode = 'native';
      })
      .then(() => {
        const currentDom = vs.getCurrentviewDom();
        const divs = vm.$el.querySelectorAll('.__view div');
        expect(currentDom.length).toBe(1);
        expect(currentDom[0]).toEqual(divs[1]);
        vm.ops.vuescroll.mode = 'slide';
      })
      .then(() => {
        vs.scrollIntoView('#d3');
      })
      .wait(350)
      .then(() => {
        const currentDom = vs.getCurrentviewDom();
        expect(currentDom[0].id).toBe('d3');
        vm.ops.vuescroll.paging = false;
        vm.ops.vuescroll.pullRefresh.enable = true;
        vm.ops.vuescroll.pushLoad.enable = true;
      })

      .then(() => {
        vs.triggerRefreshOrLoad('refresh');
      })
      .wait(350)
      .then(() => {
        const refreshDom = vs.$el.querySelector('.__refresh');
        expect(refreshDom.innerText).toBe('Refreshing...');
      })
      .wait(2550)
      .then(() => {
        vs.triggerRefreshOrLoad('load');
      })
      .wait(350)
      .then(() => {
        const loadDom = vs.$el.querySelector('.__load');
        expect(loadDom.innerText).toBe('Loading...');
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
    // create two instances to test refreshAll api
    const vs0 = vm[0].$refs['vs'];
    const vs1 = vm[1].$refs['vs'];
    vs0.$el.style.display = 'none';
    vs1.$el.style.display = 'none';
    _vs.refreshAll();
    startSchedule()
      .then(() => {
        let vsAmout = document.querySelectorAll('.__rail-is-vertical').length;
        expect(vsAmout).toBe(0);
        vs0.$el.style.display = 'block';
        vs0.refresh();
      })
      .then(() => {
        let hRails = document.querySelectorAll('.__rail-is-horizontal');
        let vRails = document.querySelectorAll('.__rail-is-vertical');
        expect(hRails.length).toBe(1);
        expect(vRails.length).toBe(1);
        vs1.$el.style.display = 'block';

        _vs.refreshAll();
      })
      .then(() => {
        let hRails = document.querySelectorAll('.__rail-is-horizontal');
        let vRails = document.querySelectorAll('.__rail-is-vertical');
        expect(hRails.length).toBe(2);
        expect(vRails.length).toBe(2);
        done();
      });
  });

  // Scrolling times test

  it('Api: getScrollingTimes, clearScrollingTimes', done => {
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
              mode: 'slide'
            }
          }
        }
      },
      true
    );

    const vs = vm.$refs['vs'];

    startSchedule()
      .then(() => {
        const times = vs.getScrollingTimes();
        expect(times).toBe(0);
        vs.scrollTo({ y: '10%' });
      })
      .wait(520)
      .then(() => {
        let times = vs.getScrollingTimes();
        expect(times).toBe(1);

        vs.clearScrollingTimes();

        times = vs.getScrollingTimes();

        expect(times).toBe(0);

        done();
      });
  });

  // ScrollTop should be 50 #51
  it('scrollTop should be 50', done => {
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
      .then(() => {
        vs.scrollTo(
          {
            y: '50%'
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(50);
        done();
      });
  });

  it('scrollTo(public)', done => {
    const height = document.scrollingElement.scrollHeight + 100;
    const width = document.scrollingElement.scrollWidth + 100;
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: width,
            h: height
          },
          {
            w: width,
            h: height
          },
          '',
          3
        ),
        data: {
          ops: {}
        }
      },
      true
    );

    _vs.scrollTo(document, undefined /* X */, 100 /* Y */, 300 /* 300ms */);

    startSchedule(350)
      .then(() => {
        expect(window.pageYOffset).toBe(100);
        _vs.scrollTo(document, 100 /* X */, undefined /* Y */, 300 /* 300ms */);
      })
      .wait(350)
      .then(() => {
        expect(window.pageXOffset).toBe(100);
        done();
      });
  });
});
