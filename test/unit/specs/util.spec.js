import { deepCopy, deepMerge } from 'src/shared/util';

describe('Util', () => {
  it('after deeping copy, b[1].a1 should be 2', () => {
    const a = [{ a1: 1 }, { a1: 2 }];
    const b = deepCopy(a);
    expect(b[1].a1).toBe(2);
    a[1].a1 = 3;
    expect(b[1].a1).toBe(2);
  });

  it('deep copy a dom', () => {
    const a = document.createElement('div');
    const b = deepCopy(a, b);
    expect(b.nodeType).not.toBe(null);
  });

  it('deep merge shallowly,force', () => {
    const foo = document.createElement('div');
    const a = [[1], [2], foo];
    const b = [undefined, 2, 'bar'];
    const c = deepMerge(a, b, true /* force */, true /*  shallow */);

    expect(c[0][0]).toBe(1);
    expect(c[1][0]).toBe(2);
    expect(c[2].nodeType).not.toBe(null);
  });
});
