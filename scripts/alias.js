const path = require("path");

const resolve = p => path.resolve(__dirname, "../", p);

const root = "src";

module.exports = {
  vuescroll: resolve(root + "/index"),
  root: resolve(root),
  test: resolve("./test"),
  vue$: "vue/dist/vue.js"
};