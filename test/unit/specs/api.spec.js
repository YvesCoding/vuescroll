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
      vm.forEach((v) => {
        destroyVM(v);
      });
    } else {
      destroyVM(vm);
    }
  });

  it('scrollTo(native)', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 1000,
            h: 1000
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
            y: 300,
            x: 400
          },
          300
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(300);
        expect(Math.ceil(scrollLeft)).toBe(400);

        // scroll X axis
        vs.scrollTo(
          {
            x: 500,
            y: 600
          },
          400
        );
      })
      .wait(305)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollLeft)).not.toBe(500);
        expect(Math.ceil(scrollTop)).not.toBe(600);
      })
      .wait(150)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollLeft)).toBe(500);
        expect(Math.ceil(scrollTop)).toBe(600);

        done();
      });
  });

  it('scrollTo(slide)', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 1000,
            h: 1000
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
            y: 300,
            x: 250
          },
          300
        );
      })
      .wait(350)
      .then(() => {
        const { __scrollTop, __scrollLeft } = vs.scroller;
        expect(Math.ceil(__scrollTop)).toBe(300);
        expect(Math.ceil(__scrollLeft)).toBe(250);
        // scroll X axis
        vs.scrollTo(
          {
            x: 500,
            y: 450
          },
          400
        );
      })
      .wait(350)
      .then(() => {
        const { __scrollTop, __scrollLeft } = vs.scroller;
        expect(Math.ceil(__scrollTop)).not.toBe(450);
        expect(Math.ceil(__scrollLeft)).not.toBe(500);
      })
      .wait(100)
      .then(() => {
        const { __scrollTop, __scrollLeft } = vs.scroller;
        expect(Math.ceil(__scrollTop)).toBe(450);
        expect(Math.ceil(__scrollLeft)).toBe(500);

        done();
      });
  });

  it('scrollBy', (done) => {
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
          350
        );
      })
      .wait(400)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;

        expect(scrollTop).toBe(50);
        expect(scrollLeft).toBe(50);
        done();
      });
  });

  it('zoomBy, zoomTo', (done) => {
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
            },
            rail: {
              gutterOfEnds: '6px'
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

        expect(clientHeight).toBe(22); // (100 - 12 bar-wrap: top:6px bottom: 6px) / 2 / 2
        expect(clientWidth).toBe(22); // (100 - 12) / 2 / 2
        done();
      });
  });

  it('triggerRefreshOrLoad, goToPage ,getCurrentviewDom', (done) => {
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
        vm.ops.vuescroll.mode = 'native';
      })
      .then(() => {
        vs.scrollTo(
          {
            y: 100
          },
          false
        );
      })
      .then(() => {
        const divs = vm.$el.querySelectorAll('.__view div');
        const currentDom = vs.getCurrentviewDom();
        expect(currentDom.length).toBe(1);
        expect(currentDom[0]).toEqual(divs[1]);
        done();
      });
  });

  it('refresh, refreshAll', (done) => {
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
              mode: 'slide'
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
              mode: 'slide'
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
      .then(() => {
        vs0.$el.style.display = 'none';
        vs1.$el.style.display = 'none';

        _vs.refreshAll();
      })
      .wait(1)
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

        // #114
        // refresh should remember position.
        vs0.scrollTo(
          {
            x: 50,
            y: 50
          },
          0
        );

        _vs.refreshAll();
      })
      .then(() => {
        let hRails = document.querySelectorAll('.__rail-is-horizontal');
        let vRails = document.querySelectorAll('.__rail-is-vertical');
        expect(hRails.length).toBe(2);
        expect(vRails.length).toBe(2);

        const { scrollLeft, scrollTop } = vs0.getPosition();
        expect(scrollLeft).toBe(50);
        expect(scrollTop).toBe(50);

        done();
      });
  });

  // ScrollTop should be 50 #51
  it('scrollTo 50%, scrollTop and scrollLeft should be 150', (done) => {
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
            y: '50%',
            x: '50%'
          },
          true
        );
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(150);
        expect(Math.ceil(scrollLeft)).toBe(150);
        done();
      });
  });

  it('scrollTo(public)', (done) => {
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

  it('getScrollProcess', (done) => {
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
        const { v, h } = vs.getScrollProcess();
        expect(v).toBe(0);
        expect(h).toBe(0);

        vs.scrollTo(
          {
            x: '50%',
            y: '50%'
          },
          350
        );
      })
      .wait(400)
      .then(() => {
        const { v, h } = vs.getScrollProcess();
        expect(v).toBe(0.5);
        expect(h).toBe(0.5);

        vs.scrollTo(
          {
            x: '100%',
            y: '100%'
          },
          350
        );
      })
      .wait(400)
      .then(() => {
        const { v, h } = vs.getScrollProcess();
        expect(v).toBe(1);
        expect(h).toBe(1);

        done();
      });
  });

  it('stop pause continue(native)', (done) => {
    vm = createVue(
      {
        template: makeTemplate(
          {
            w: 1000,
            h: 1000
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
            y: 300,
            x: 400
          },
          300
        );
      })
      .wait(100)
      .then(() => {
        vs.pause();
      })
      .wait(350)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollTop)).not.toBe(300);
        expect(Math.ceil(scrollLeft)).not.toBe(400);
        vs.continue();
      })
      .wait(305)
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollTop)).toBe(300);
        expect(Math.ceil(scrollLeft)).toBe(400);

        vs.scrollTo(
          {
            y: 600,
            x: 600
          },
          300
        );
      })
      .wait(150)
      .then(() => {
        vs.stop();
      })
      .then(() => {
        const scrollPanel = vm.$el.querySelector('.__panel');
        const { scrollTop, scrollLeft } = scrollPanel;
        expect(Math.ceil(scrollTop)).not.toBe(600);
        expect(Math.ceil(scrollLeft)).not.toBe(600);

        done();
      });
  });
});
