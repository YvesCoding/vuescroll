const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

const root = "beta";

module.exports = {
  vsIns: resolve(root + '/index.ins'),
  vsUnins: resolve(root + '/index.unins')
}