const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const debug = require('debug')('app:config:webpack');
const project = require('./project.config');

const inProject = path.resolve.bind(path, project.path_base);
const inProjectSrc = (file) => inProject(project.dir_client, file);
process.traceDeprecation = true;

const __DEV__ = project.globals.__DEV__;
const __PROD__ = project.globals.__PROD__;
const __TEST__ = project.globals.__TEST__;

debug('Creating configuration.');
const config = {
  entry: {
    main: [
      inProjectSrc(project.dir_main)
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: inProject(project.dir_dist),
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
  },
  resolve: {
    modules: [
      inProject(project.dir_client),
      'node_modules'
    ],
    extensions: [ '*', '.js', '.jsx', '.json' ]
  },
  externals: {},
  module: {
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': { NODE_ENV: JSON.stringify(project.env) },
      __DEV__,
      __TEST__,
      __PROD__
    }, project.globals))
  ]
};

if (!__TEST__) {
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: [ {
      loader: 'eslint-loader',
      options: {
        failOnWarning: false,
        failOnError: false,
        fix: false,
        quiet: false
      }
    } ]
  });
}

config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [ {
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: true,
            polyfill: false, // we polyfill needed features in src/normalize.js
          }
        ],
        [
          '@babel/plugin-transform-spread',
          {
            useBuiltIns: true // we polyfill Object.assign in src/normalize.js
          }
        ]
      ],
      presets: [
        '@babel/preset-react',
        ['@babel/preset-stage-3', { "decoratorsLegacy": true }],
        [ '@babel/preset-env', {
          modules: false,
          targets: {
            ie9: true
          },
          uglify: true
        } ]
      ]
    }
  } ]
});

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__
});

config.module.rules.push({
  test: /\.css$/,
  exclude: '/node_modules/',
  loader: extractStyles.extract({
    fallback: [ {
      loader: 'style-loader'
    } ],
    use: [ {
      loader: 'css-loader'
    }, {
      loader: 'postcss-loader'
    } ]
  })
});

config.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: [ {
      loader: 'style-loader'
    } ],
    use: [ {
      loader: 'css-loader'
    }, {
      loader: 'sass-loader'
    } ]
  })
});

config.plugins.push(extractStyles);

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif|svg)$/,
  use: 'file-loader?name=[name].[ext]'
});

// Feeds
// ------------------------------------
config.module.rules.push({
  test: /\.(xml)$/,
  use: 'xml-loader?name=[name].[ext]'
});

// Documents
// ------------------------------------
config.module.rules.push({
  test: /\.(pdf)$/,
  use: 'file-loader?name=[name].[ext]'
})

// Fonts
// ------------------------------------
;[
  [ 'woff', 'application/font-woff' ],
  [ 'woff2', 'application/font-woff2' ],
  [ 'otf', 'font/opentype' ],
  [ 'ttf', 'application/octet-stream' ],
  [ 'eot', 'application/vnd.ms-fontobject' ]
].forEach((font) => {
  const extension = font[ 0 ];
  const mimetype = font[ 1 ];

  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype
    }
  });
});

// config.plugins.push(
//   new webpack.LoaderOptionsPlugin({
//     options: {
//       postcss: [
//         cssnano({
//           autoprefixer: {
//             add: true,
//             remove: true,
//             browsers: [ 'last 2 versions' ]
//           },
//           discardComments: {
//             removeAll: true
//           },
//           discardUnused: false,
//           mergeIdents: false,
//           reduceIdents: false,
//           safe: true,
//           sourcemap: true
//         })
//       ]
//     }
//   })
// );

// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
  template: inProjectSrc('index.html'),
  inject: true,
  minify: {
    collapseWhitespace: true
  }
}));

// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
  );
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
    // new BundleAnalyzerPlugin()
  );
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
  const bundles = [ 'normalize', 'manifest' ];
  if (project.compiler_vendors && project.compiler_vendors.length) {
    bundles.unshift('vendor');
    config.entry.vendor = project.compiler_vendors;
  }
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }));
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      }
    })
  );
}

module.exports = config;
