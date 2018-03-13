/**
 * rail unit-test-file
 */
import {
    trigger
}from '../../util'

describe('test vueScroll rail', () => {
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
    it('test rail click', () => {
        trigger(vs.$refs['verticalRail'].$el, 'click');
    });
});