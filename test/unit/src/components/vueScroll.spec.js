/**
 * vue scroll unit-test-file
 */
import GCF from 'root/config/GlobalConfig'
import {
    trigger
}from 'test/util'

describe('test vuescroll component', () => {
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

    it('trigger resize', (done) => {
        ins.childHeight = '500px';
        setTimeout(() => {
            done();
        }, 600);
    });

    it('test non-native mode', (done) => {
        document.body.removeChild(ins.$el);
        data.ops.vuescroll = {
            mode: 'non-native'
        }
        ins = new Vue({
            template,
            data
        }).$mount();
        vs = ins.$refs['vsIns'];
        data.ops.vuescroll.mode = 'native';
        vs.$nextTick(() => {
            vs.scrollTo({
                x: 10,
                y: 10
            }, false)
            done();
        })
        document.body.appendChild(ins.$el);
    });
});