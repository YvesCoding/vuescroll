const path = require('path');
const fs = require('fs');

const resolve = (p) => path.resolve(__dirname, '../', p);
const alias = {
  src: resolve('src'),
  test: resolve('./test'),
  vue$: 'vue/dist/vue.cjs.js'
};

const extend = (alias) => {
  const dirs = fs.readdirSync(alias.src);
  dirs.forEach((dir) => {
    alias[dir] = `${alias.src}/${dir}`;
  });
};
extend(alias);

module.exports = alias;
