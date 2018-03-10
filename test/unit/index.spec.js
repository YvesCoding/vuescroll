import Vue from 'vue/dist/vue'
import vuescroll from 'vsUnins'

describe('vuescroll-install-test', () => {
    it('vuescroll should not be installed', () => {
        expect(vuescroll.isInstalled).toBeUndefined();
    });

    it('vuescroll should be installed', () => {
        Vue.use(vuescroll);
        vuescroll.install(Vue);
        expect(vuescroll.isInstalled).toBe(true);
    })
})