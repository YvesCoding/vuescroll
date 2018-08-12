import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule,
  trigger
} from 'test/unit/util';

describe('rail', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });

  it('vBar and hBar should scroll to middle after clicking the middle of the rail', done => {
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

        const vRail = vs.$el.querySelector('.__rail-is-vertical');
        const offset = vRail.offsetHeight;
        const clientY = vRail.getBoundingClientRect().top + offset / 2;
        trigger(vRail, 'click', { clientY });
      })
      .wait(350)
      .then(() => {
        const styleOfTransform = vs.$el.querySelector('.__bar-is-vertical')
          .style.transform;
        expect(styleOfTransform).toBe('translateY(50%)');
        expect(panelElm.scrollTop).toBe(maxScrollTop / 2);
      })
      .then(() => {
        const hRail = vs.$el.querySelector('.__rail-is-horizontal');
        const offset = hRail.offsetWidth;
        const clientX = hRail.getBoundingClientRect().left + offset / 2;
        trigger(hRail, 'click', { clientX });
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
});
