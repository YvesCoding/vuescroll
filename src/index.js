import Vue from 'vue';
// import component
import vuescroll from './components/vuescroll';

// import config
import GCF from './config/GlobalConfig';


let scroll = {
    install(Vue) {
        if(scroll.isInstalled) {
            console.warn("You should not install the vuescroll again!")
            return;
        }
        //vueScroll
        Vue.component(vuescroll.name, vuescroll);

        // registry the globe setting
        Vue.prototype.$vuescrollConfig = GCF

        scroll.isInstalled = true;
         
     }
};
/* istanbul ignore if */
if(typeof Vue !== 'undefined' && process.env.NODE_FORMAT === 'umd') {
    Vue.use(scroll);
}

export default scroll;