import Vue from "vue/dist/vue";
import vuescroll from "vuescroll";
import {
  deepMerge
} from "root/util";

window.deepMerge = deepMerge;

window.Vue = Vue;

window.globalData = {
  parentWidth: "200px",
  parentHeight: "200px",
  childHeight: "400px",
  childWidth: "400px",
  ops: {
    scrollPanel: {
    },
    scrollContent: {
    },
    vRail: {
    },
    vBar: {
    },
    hRail: {
    },
    hBar: {
    }
  }
};

window.template = `
    <div :style="{width: parentWidth, height: parentHeight}">
        <vue-scroll ref="vsIns" :ops="ops">
            <div :style="{width: childWidth, height: childHeight}">
            </div>
        </vue-scroll>
    </div>
`;

describe("vuescroll-install-test", () => {
  it("vuescroll should not be installed", () => {
    expect(vuescroll.isInstalled).toBeUndefined();
  });

  it("vuescroll should be installed", () => {
    Vue.use(vuescroll);

    // no sense, just to improve the code coverage
    vuescroll.install(Vue);

    expect(vuescroll.isInstalled).toBe(true);
  });
});

// require all test files
const testsContext = require.context("./", true, /\.spec$/);
testsContext.keys().forEach(testsContext);
