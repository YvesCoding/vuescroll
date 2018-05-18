import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';

describe('api', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
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
    vs.scrollTo(
      {
        y: 300
      },
      true
    );
    startSchedule(350)
      .then(r => {
        const scrollPanel = vm.$el.querySelector('.vuescroll-panel');
        const { scrollTop } = scrollPanel;
        // note: in chrome , scrollHeight is added extra 4px than actual content
        // so we should add 4 to let test pass.\
        // https://stackoverflow.com/questions/29132892/how-to-auto-resize-an-input-field-vertically-and-not-horizontally-like-facebook/29133328#29133328
        expect(scrollTop).toBe(104);
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
        expect(scrollLeft).toBe(100);
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

    vs.scrollBy(
      {
        dy: 50,
        dx: 50
      },
      true
    );
    startSchedule(350).then(r => {
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

    vs.zoomBy(
      0.5, // factor self.__zoomLevel = self.__zoomLevel * factor
      true
    );
    startSchedule(350)
      .then(r => {
        let vBar = vm.$el.querySelector('.vuescroll-vertical-scrollbar');
        let hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');

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
        let vBar = vm.$el.querySelector('.vuescroll-vertical-scrollbar');
        let hBar = vm.$el.querySelector('.vuescroll-horizontal-scrollbar');

        expect(vBar).not.toBe(null);
        expect(hBar).not.toBe(null);
        vs.zoomTo(2, true); // now level 1 * 2 = 2;
        r();
      })
      .wait(350)
      .then(r => {
        let { clientHeight } = vm.$el.querySelector(
          '.vuescroll-vertical-scrollbar'
        );
        let { clientWidth } = vm.$el.querySelector(
          '.vuescroll-horizontal-scrollbar'
        );

        expect(clientHeight).toBe(25); // 100 / 2 / 2
        expect(clientWidth).toBe(25); // 100 / 2 / 2
        r();
        done();
      });
  });

  it('goToPage, getCurrentPage, getCurrentviewDom, scrollIntoView', done => {
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
        // done();
      })
      .wait(350)
      .then(r => {
        const currentDom = vs.getCurrentviewDom();
        expect(currentDom[0].id).toBe('d3');
        r();
        done();
      });
  });
});
