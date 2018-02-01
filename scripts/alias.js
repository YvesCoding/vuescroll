const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vsIns: resolve('src/index.ins'),
  vsUnins: resolve('src/index.unins')
}