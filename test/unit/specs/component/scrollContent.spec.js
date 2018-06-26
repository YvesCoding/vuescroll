import { createVue, destroyVM } from 'test/unit/util';
import scrollContent from 'src/components/child-components/vuescroll-content';

describe('scroll-content', () => {
  let vm;

  afterEach(() => {
    destroyVM(vm);
  });
  // create a rail and test its style
  it("scrollContent's width and height should be equal to the children' height and width ", () => {
    vm = createVue(
      {
        template: `
        <div style="width:10px;height:10px">
        <scrollContent :ops="ops">
          <div
          v-for="i in total"
          :key="i"
          :style="{width:w + 'px',height:h + 'px'}"
          >
          </div>
        </scrollContent>
        </div>
      `,
        data: {
          ops: {
            tag: 'div'
          },
          total: 10,
          w: 10,
          h: 10
        },
        components: {
          scrollContent
        }
      },
      true
    );
    const contentElm = vm.$el.querySelector('.__view');
    const { clientWidth, clientHeight } = contentElm;
    expect(clientWidth).toBe(vm.w);
    expect(clientHeight).toBe(vm.total * vm.h);
  });

  // test whether padding works or not
  it('test padding', () => {
    vm = createVue(
      {
        template: `
        <div style="width:10px;height:10px">
        <scrollContent :ops="ops">
        </scrollContent>
        </div>
      `,
        data: {
          ops: {
            tag: 'div',
            padding: true,
            paddPos: 'padding-right',
            paddValue: '10px'
          }
        },
        components: {
          scrollContent
        }
      },
      true
    );
    const contentElmSty = vm.$el.querySelector('.__view').style;
    const paddingRight = contentElmSty['padding-right'];
    expect(paddingRight).toBe('10px');
  });
});
