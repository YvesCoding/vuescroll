// import component
import vRail from './vRail';
import vScrollbar from './vScrollbar';
import hRail from './hRail';
import hScrollbar from './hScrollbar';
import vueScrollContent from './vueScrollContent';
import vueScrollPanel from './vueScrollPanel';
import vueScroll from './vueScroll';

// import config
import GCF from './GlobalConfig'


var scroll = {
    install: function(Vue) {
        Vue.component(vRail.name, vRail);
        Vue.component(vScrollbar.name, vScrollbar);
        Vue.component(hRail.name, hRail);
        Vue.component(hScrollbar.name, hScrollbar);
        Vue.component(vueScrollContent.name, vueScrollContent);
        Vue.component(vueScrollPanel.name, vueScrollPanel);
        //vueScroll
        Vue.component(vueScroll.name, vueScroll);

        // registry the globe setting
        Vue.prototype.$vuescrollConfig = GCF
    }
};

export default scroll;