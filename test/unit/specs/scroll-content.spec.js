import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule
} from 'test/unit/util';

describe('scroll-content', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
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
            rail: {
              size: '10px'
            },
            scrollContent: {
              padding: true
            }
          }
        }
      },
      true
    );

    const vsElm = vm.$refs['vs'].$el;
    startSchedule().then(() => {
      const contentElm = vsElm.querySelector('.__view');
      expect(contentElm.style.paddingRight).toBe('10px');

      done();
    });
  });
});
