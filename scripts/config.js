// rollup.config.js
const resolveNode = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace')
const path = require('path')
const version = process.env.VERSION || require('../package.json').version
 
const banner =
   `/*
    * @name: vuescroll ${version}
    * @author: (c) 2018-${new Date().getFullYear()} wangyi7099
    * @description: A reactive virtual scrollbar based on vue.js 2.X
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   `;

const aliases = require('./alias')

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const root = aliases.root;

const builds = {
   'web-dev': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.js'),
    format: 'umd',
    external: ['vue'],
    banner
  },
   'web-prod': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.min.js'),
    format: 'umd',
    external: ['vue'],
    banner
  },
   'esm-dev': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.esm.js'),
    format: 'es',
    external: ['vue'],
    banner
  },
  'esm-pro': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.esm.min.js'),
    format: 'es',
    external: ['vue'],
    banner
  },
   'cjs-dev': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.common.js'),
    format: 'cjs',
    external: ['vue'],
    banner
  },
  'cjs-pro': {
    entry: resolve(root + '/index.js'),
    dest: resolve('dist/vuescroll.common.min.js'),
    format: 'cjs',
    external: ['vue'],
    banner
  }
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    output: {
      globals: {
        vue: 'Vue'
      },
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'vuescroll'
    },
    plugins: [
      resolveNode(),
      babel({
        exclude: 'node_modules/**', // only transpile our source code
      }),
      replace({
        'process.env.NODE_FORMAT': JSON.stringify(opts.format)
      })
    ]
  }

   

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

exports.getBuild = genConfig
exports.getAllBuilds = () => Object.keys(builds).map(genConfig)