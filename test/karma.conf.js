// Karma configuration
// Generated on Tue Jan 30 2018 19:35:39 GMT+0800 (中国标准时间)

var webpack = require('webpack');
var alias = require('../scripts/alias');
var webpack = {
  resolve: {
    alias: alias
  },
  module: {
    rules:[
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: [['istanbul', { }]]
        } 
      }
    ]
  },
  devtool: '#inline-source-map'
};
module.exports = function(config) {
  config.set({
    webpack: webpack,
    plugins: [
      'karma-jasmine',
      'jasmine-core',
      'karma-webpack',
      'karma-coverage',
      'karma-sourcemap-loader',
      //'karma-phantomjs-launcher'
      'karma-chrome-launcher'
    ],
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './unit/**/*.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './unit/**/*.spec.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: './coverage', subdir: '.' },
        { type: 'text-summary', dir: './coverage', subdir: '.' }
      ]
    },


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
