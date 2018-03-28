/**
 * bar unit-test-file
 */
import {
    trigger
}from 'test/util'

describe('test vueScrollBar component', () => {
    let ins = null;
    let vs = null;
    let data = deepMerge(globalData, {});
    data.ops.vBar.hover = "red";
    data.ops.vBar.keepShow = true;
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
        setTimeout(() => {
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
        }, 0);
    });

    it('test hover options', () => {
        trigger(
            vs.$refs['verticalBar'].$el, 
            'mouseenter'
        )
        expect(vs.$refs['verticalBar'].$el.style.background).toBe("red");
        trigger(
            vs.$refs['verticalBar'].$el, 
            'mouseleave'
        )
        expect(vs.$refs['verticalBar'].$el.style.background).not.toBe("red");
    });
});