import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule,
  Vue
} from 'test/unit/util';

describe('vuescroll slot test', () => {
  let vm;

  Vue.component('test-slot', {
    template: '<div :data-name="name"><slot></slot></div>',
    props: ['name']
  });

  afterEach(() => {
    destroyVM(vm);
  });

  /** Slotted content is a component */

  it('data-name should be `container`', done => {
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
    startSchedule().then(() => {
      expect(vs.$el.dataset.name).toBe('container');
      done();
    });
  });

  it('data-name should be `panel`', done => {
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
    startSchedule().then(() => {
      expect(vs.$el.querySelector('.__panel').dataset.name).toBe('panel');
      done();
    });
  });

  it('data-name should be `content`', done => {
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
    startSchedule().then(() => {
      expect(vs.$el.querySelector('.__view').dataset.name).toBe('content');
      done();
    });
  });

  it('The dom\'s tag should be ul', done => {
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
            <ul slot="scroll-panel">
              <li>1</li>
            </ul>
          `
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
    startSchedule().then(() => {
      expect(vs.$el.querySelector('.__panel').tagName.toLowerCase()).toBe('ul');
      done();
    });
  });
});
