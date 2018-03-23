/**
 * vuescrollApi unit-test-file
 */


describe('test vuescrollApi', () => {
    let ins = null;
    let vs = null;
    let data = deepMerge(globalData, {});
    data.ops.scrollPanel = {
        speed: 500
    }
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
    it('scroll x or y', (done) => {
        setTimeout(() => {
            vs.scrollTo({
                x: '10%',
            })
            setTimeout(() => {
                const left = vs.$refs['scrollPanel'].$el.scrollLeft;
                expect(left).toBe(vs.$refs['scrollPanel'].$el.scrollWidth * 0.1);
                vs.scrollTo({
                    y: 100
                })
                setTimeout(() => {
                    const top = vs.$refs['scrollPanel'].$el.scrollTop;
                    expect(top).toBe(100);
                    done();
                }, 700);
            }, 700); 
        }, 100);
    });
    
});