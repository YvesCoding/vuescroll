
// import component
import vuescroll from './vuescroll';

// import config
import GCF from './GlobalConfig'


let scroll = {
    install(Vue) {
        /* istanbul ignore if */
        if(scroll.isInstalled) {
            console.warn("You should not install the vuescroll again!")
            return;
        }
        //vuescroll
        Vue.component(vuescroll.name, vuescroll);

        // registry the globe setting
        Vue.prototype.$vuescrollConfig = GCF
        
        scroll.isInstalled = true;
     }
};

export default scroll;