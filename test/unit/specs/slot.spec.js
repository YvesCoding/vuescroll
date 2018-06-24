import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule,
  Vue
} from 'test/unit/util';

describe('test-slot', () => {
  let vm;

  Vue.component('test-slot', {
    template: '<div :data-id="name"><slot></slot></div>',
    props: ['name']
  });

  afterEach(() => {
    destroyVM(vm);
  });

  it('contaner\'s dataset id should be container', done => {
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
          },
          '',
          1,
          `
            <test-slot slot="scroll-container" name="container">
            </test-slot>
          `
        ),
        data: {
          ops: {}
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule()
      .wait(1)
      .then(r => {
        expect(vs.$el.dataset.id).toBe('container');
        r();
        done();
      });
  });

  it('scroll-panel\'s dataset id should be panel', done => {
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
          },
          '',
          1,
          `
            <test-slot slot="scroll-panel" name="panel">
            </test-slot>
          `
        ),
        data: {
          ops: {}
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule()
      .wait(1)
      .then(r => {
        expect(vs.$el.querySelector('.vuescroll-panel').dataset.id).toBe(
          'panel'
        );
        r();
        done();
      });
  });

  it('scroll-ccontent dataset id should be content', done => {
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
          },
          '',
          1,
          `
            <test-slot slot="scroll-content" name="content">
            </test-slot>
          `
        ),
        data: {
          ops: {}
        }
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule()
      .wait(1)
      .then(r => {
        expect(vs.$el.querySelector('.vuescroll-content').dataset.id).toBe(
          'content'
        );
        r();
        done();
      });
  });
});
