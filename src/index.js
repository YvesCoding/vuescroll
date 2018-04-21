import Vue from "vue";
// import component
import vuescroll from "./components/vuescroll";

// import config
import GCF from "./config/GlobalConfig";

import {
  deepMerge
} from "./util";

let scroll = {
  install(Vue) {
    if(scroll.isInstalled) {
      console.warn("You should not install the vuescroll again!"); //eslint-disable-line
      return;
    }
    //vueScroll
    Vue.component(vuescroll.name, vuescroll);

    // registry the globe setting
    // feat: #8
    Vue.prototype.$vuescrollConfig = deepMerge(GCF, {});

    scroll.isInstalled = true;
         
  }
};
/* istanbul ignore if */
if(typeof Vue !== "undefined" && process.env.NODE_FORMAT === "umd") {
  Vue.use(scroll);
}

export default scroll;