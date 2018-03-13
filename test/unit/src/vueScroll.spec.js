/**
 * vue scroll unit-test-file
 */
import GCF from 'root/config/GlobalConfig'
import {
    trigger
}from '../../util'

describe('vuescroll-test', () => {
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
    it('test default global GCF', () => {
        
        // test scrollPanel options
        expect(vs.mergedOptions.scrollPanel).toEqual(GCF.scrollPanel);
        // test scrollContent options
        expect(vs.mergedOptions.scrollContent).toEqual(GCF.scrollContent);
        // test vRail options
        expect(vs.mergedOptions.vRail).toEqual(GCF.vRail);
        // test vBar options
        expect(vs.mergedOptions.vBar).toEqual(GCF.vBar);
        // test hRail options
        expect(vs.mergedOptions.hRail).toEqual(GCF.hRail);
        // test hBar options
        expect(vs.mergedOptions.hBar).toEqual(GCF.hBar);
    });

    it('test mouse enter and leave', (done) => {
        trigger(vs.$el, 'mouseenter');
        ins.$nextTick(() => {
            expect(vs.vBar.state.opacity).toBe(vs.mergedOptions.vBar.opacity);
            trigger(vs.$el, 'mouseleave');
            ins.$nextTick(() => {
                expect(vs.vBar.state.opacity).toBe(0);
                done();
            })
        })
    });

    it('test scrollTo api', (done) => {
        vs.scrollTo({
            x: 100,
            y: 100
        });
        ins.$nextTick(() => {
            // use scrollTo api will not trigger 
            // scroll automatically,
            // so, we trigger scroll manually,
            trigger(vs.scrollPanelElm, 'scroll');

            expect(vs.scrollPanelElm.scrollTop).toBe(100);
            expect(vs.scrollPanelElm.scrollLeft).toBe(100);
            done();
        })
    });

    it('give an accuracy that is smaller than 0', (done) => {
        data.accuracy = -1;
        ins.$nextTick(() => {
            data.accuracy = 0;
            done();
        })
    });
});