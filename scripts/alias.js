const path = require('path');

const resolve = p => path.resolve(__dirname, '../', p);

const src = 'src';

module.exports = {
  vuescroll: resolve(root + '/index'),
  src: resolve(src),
  test: resolve('./test'),
  vue$: 'vue/dist/vue.js'
};