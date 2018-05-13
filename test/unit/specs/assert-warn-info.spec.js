// https://github.com/vuejs/vue/blob/dev/test/helpers/to-have-been-warned.js
import { destroyVM, createVue, makeTemplate } from 'test/unit/util';
function noop() {}

if (typeof console === 'undefined') {
  window.console = {
    warn: noop,
    error: noop
  };
}

// avoid info messages during test
console.info = noop;

let asserted;

function createCompareFn(spy) {
  const hasWarned = msg => {
    var count = spy.calls.count();
    var args;
    while (count--) {
      args = spy.calls.argsFor(count);
      if (args.some(containsMsg)) {
        return true;
      }
    }

    function containsMsg(arg) {
      return arg.toString().indexOf(msg) > -1;
    }
  };

  return {
    compare: msg => {
      asserted = asserted.concat(msg);
      var warned = Array.isArray(msg) ? msg.some(hasWarned) : hasWarned(msg);
      return {
        pass: warned,
        message: warned
          ? 'Expected message "' + msg + '" not to have been warned'
          : 'Expected message "' + msg + '" to have been warned'
      };
    }
  };
}
describe('assert-warn-info', () => {
  let vm;
  // define custom matcher for warnings
  beforeEach(() => {
    asserted = [];
    spyOn(console, 'warn');
    spyOn(console, 'error');
    jasmine.addMatchers({
      toHaveBeenWarned: () => createCompareFn(console.error),
      toHaveBeenTipped: () => createCompareFn(console.warn)
    });
  });

  afterEach(done => {
    const warned = msg =>
      asserted.some(assertedMsg => msg.toString().indexOf(assertedMsg) > -1);
    let count = console.error.calls.count();
    let args;
    while (count--) {
      args = console.error.calls.argsFor(count);
      if (!warned(args[0])) {
        done.fail(`Unexpected console.error message: ${args[0]}`);
        return;
      }
    }
    destroyVM(vm);
    done();
  });

  it('test incorrect mode', () => {
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
              mode: 'error-mode'
            }
          }
        }
      },
      true
    );
    expect(
      'The vuescroll\'s option "mode" should be one of the'
    ).toHaveBeenWarned();
  });

  it('paging, snapping  pull to refresh/push to load all true', () => {
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
              mode: 'slide',
              paging: true,
              snapping: {
                enable: true
              },
              pullRefresh: /* or pushLoad */ {
                enable: true
              }
            }
          }
        }
      },
      true
    );
    expect(
      'paging, snapping, (pullRefresh with pushLoad) can only one of them to be true'
    ).toHaveBeenWarned();
  });

  it('error initialScrollY/initialScrollX', () => {
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
            scrollPanel: {
              initialScrollY: 'aaa',
              initialScrollX: 'bbb'
            }
          }
        }
      },
      true
    );
    expect(
      'The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.'
    ).toHaveBeenWarned();
    expect(
      'The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.'
    ).toHaveBeenWarned();
  });

  it('paging, snapping  pull to refresh/push to load all true', () => {
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
              mode: 'slide',
              paging: true,
              snapping: {
                enable: true
              },
              pullRefresh: /* or pushLoad */ {
                enable: true
              }
            }
          }
        }
      },
      true
    );
    expect(
      'paging, snapping, (pullRefresh with pushLoad) can only one of them to be true'
    ).toHaveBeenWarned();
  });

  it('using zoomBy, zoomTo, getCurrentPage, goToPage that is not in slide mode', () => {
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
    vs.zoomBy();
    vs.zoomTo();
    vs.getCurrentPage();
    vs.goToPage();
    expect(
      'getCurrentPage and goToPage are only for slide mode and paging is enble!'
    ).toHaveBeenTipped();
    expect('zoomBy and zoomTo are only for slide mode!').toHaveBeenTipped();
  });
});
