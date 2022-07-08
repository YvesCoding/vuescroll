import {
  destroyVM,
  createVue,
  makeTemplate,
  startSchedule,
  Vue
} from 'test/unit/util';

describe('vuescroll slot test', () => {
  let vm;

  const comps = {
    components: {
      'test-slot': {
        template: '<div :data-name="name"><slot></slot></div>',
        props: ['name']
      }
    }
  };

  afterEach(() => {
    destroyVM(vm);
  });

  /** Slotted content is a component */

  it('data-name should be `container`', (done) => {
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
          <template v-slot:scroll-container>
            <test-slot  name="container">
            </test-slot>
            </template>
          `
        ),
        data: {
          ops: {}
        },
        ...comps
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule().then(() => {
      expect(vs.$el.dataset.name).toBe('container');
      done();
    });
  });

  it('data-name should be `panel`', (done) => {
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
          <template v-slot:scroll-panel>
          <test-slot  name="panel">
          </test-slot>
          </template>

          `
        ),
        data: {
          ops: {}
        },
        ...comps
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule().then(() => {
      expect(vs.$el.querySelector('.__panel').dataset.name).toBe('panel');
      done();
    });
  });

  it('data-name should be `content`', (done) => {
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
          <template v-slot:scroll-content>
          <test-slot  name="content">
          </test-slot>
          </template>
          `
        ),
        data: {
          ops: {}
        },
        ...comps
      },
      true
    );
    const vs = vm.$refs['vs'];
    startSchedule().then(() => {
      expect(vs.$el.querySelector('.__view').dataset.name).toBe('content');
      done();
    });
  });

  it("The dom's tag should be ul", (done) => {
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
          <template v-slot:scroll-panel>
          <ul>
              <li>1</li>
            </ul>
          </template>

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
