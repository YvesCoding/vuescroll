const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

const root = "src";

module.exports = {
  vsIns: resolve(root + '/index.ins'),
  vsUnins: resolve(root + '/index.unins'),
  root: resolve(root),
  test: resolve('./test'),
  vue$: 'vue/dist/vue.js'
}