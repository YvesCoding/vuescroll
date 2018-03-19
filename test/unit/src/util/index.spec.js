/**
 * util test file
 */
import {
    hideSystemBar 
}from 'root/util'

describe('test util', () => {
    it('cilentWidth/clientHeight should be equal to offsetWidth/offsetHeight', (done) => {
        let parent = document.createElement('div');
        let child = document.createElement('div');
        parent.appendChild(child);
        parent.style.height = '100px';
        parent.style.width = '100px';
        parent.style.overflow = 'scroll';
        parent.classList.add('scrollPanel');
        child.style.height = '200px';
        child.style.width = '200px';
        document.body.appendChild(parent);
        hideSystemBar();
        Promise.resolve().then(() => {
            expect(parent.clientWidth).toBe(parent.offsetWidth);
            expect(parent.clientHeight).toBe(parent.offsetHeight);
            done();
        })
    });
});