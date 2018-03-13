/**
 * bar unit-test-file
 */
import {
    trigger
}from '../../util'

describe('test vueScroll bar', () => {
    let ins = null;
    let vs = null;
    let data = deepMerge(globalData, {});
    beforeAll(() => {
        ins = new Vue({
            template,
            data
        }).$mount();
        vs = ins.$refs['vsIns'];
        document.body.appendChild(ins.$el);
    })
    afterAll(() => {
        ins.$destroy();
        document.body.removeChild(ins.$el);
    })
    it('test mousemove and movedown', (done) => {
        trigger(vs.$refs['verticalBar'].$el, 'mousedown');
        trigger(vs.$refs['verticalBar'].$el, 'mousemove');
        ins.$nextTick(() => {
            expect(vs.mousedown).toBe(true);
            trigger(document, 'mouseup');
            ins.$nextTick(() => {
                expect(vs.mousedown).toBe(false);
                done();
            })
        })
    });
});