import {
  destroyVM,
  createVue,
  makeTemplate,
  trigger,
  startSchedule
} from 'test/unit/util';

const hasClass = (el, name) => {
  return el.classList.contains(name);
};

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

  it('class hook: hasVBar, hasHBar', done => {
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
    const vs = vm.$refs['vs'].$el;
    const vmel = vm.$el;

    startSchedule()
      .then(() => {
        expect(hasClass(vs, 'hasVBar')).toBe(true);
        expect(hasClass(vs, 'hasHBar')).toBe(true);

        vmel.style.width = '200px';
        vmel.style.height = '200px';
        vm.$refs['vs'].refresh();
      })
      .wait(100)
      .then(() => {
        expect(hasClass(vs, 'hasVBar')).toBe(false);
        expect(hasClass(vs, 'hasHBar')).toBe(false);

        done();
      });
  });

  it('class hook: vBarVisible, hBarVisible', done => {
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
              onlyShowBarOnScroll: false
            }
          }
        }
      },
      true
    );
    const vs = vm.$refs['vs'].$el;

    startSchedule(1000)
      .then(() => {
        expect(hasClass(vs, 'vBarVisible')).toBe(false);
        expect(hasClass(vs, 'hBarVisible')).toBe(false);

        trigger(vs, 'mouseenter');
      })
      .wait(1)
      .then(() => {
        expect(hasClass(vs, 'vBarVisible')).toBe(true);
        expect(hasClass(vs, 'hBarVisible')).toBe(true);

        trigger(vs, 'mouseleave');
      })
      .wait(1)
      .then(() => {
        expect(hasClass(vs, 'vBarVisible')).toBe(false);
        expect(hasClass(vs, 'hBarVisible')).toBe(false);

        done();
      });
  });
});
