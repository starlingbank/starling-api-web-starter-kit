const argv = require('yargs').argv;
const webpackConfig = require('./webpack.config');
const project = require('./project.config');

const TEST_BUNDLE = './tests/test-bundler.js';

const karmaConfig = {
  basePath: '../',
  browsers: [ 'PhantomJS' ],
  singleRun: !argv.watch,
  files: [ {
    pattern: TEST_BUNDLE,
    watched: false,
    served: true,
    included: true
  } ],
  frameworks: [ 'mocha' ],
  reporters: [ 'mocha' ],
  coverageReporter: {
    reporters: [
      { type: 'text-summary' },
      { type: 'lcov', dir: 'coverage' },
    ],
  },
  preprocessors: {
    [TEST_BUNDLE]: [ 'webpack' ]
  },
  logLevel: 'WARN',
  browserConsoleLogOptions: {
    terminal: true,
    format: '%b %T: %m',
    level: 'debug'
  },
  webpack: {
    entry: TEST_BUNDLE,
    devtool: 'source-map',
    module: webpackConfig.module,
    plugins: webpackConfig.plugins,
    resolve: webpackConfig.resolve,
    externals: {
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react'
    }
  },
  webpackMiddleware: {
    stats: 'normal',
    noInfo: false
  }

};

if (project.globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.rules.push({
    test: /\.(js|jsx)$/,
    use: {
      loader: 'istanbul-instrumenter-loader',
      options: { esModules: true }
    },
    enforce: 'post',
    exclude: /node_modules|\.spec\.js$/
  });
}

module.exports = (cfg) => cfg.set(karmaConfig);
