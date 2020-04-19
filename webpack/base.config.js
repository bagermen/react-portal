/*jslint node: true */
"use strict";
const path = require('path');
const webpack = require('webpack');
const CONFIG = require('./configs');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  mode: `${process.env.NODE_ENV}`,
  context: CONFIG.CONTEXT,
  entry: {
    core_styles: [
      'typeface-raleway',
      'material-design-icons/iconfont/material-icons.css',
      'bootstrap/dist/css/bootstrap.css',
      'font-awesome/css/font-awesome.css',
      'nvd3/build/nv.d3.min.css',
      path.join(CONFIG.CONTEXT, `dist/css/${process.env.THEME}/app.less`)
    ],
    main: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      'bootstrap/dist/js/bootstrap',
      path.join(CONFIG.CONTEXT, 'index.js')
    ]
  },
  output: {
    path: CONFIG.OUTPUT,
    filename: CONFIG.JS_BUILD_FOLDER + '/' + CONFIG.JS_TEMPLATE_NAME,
    publicPath: CONFIG.SERVER_BASE
  },
  resolve: {
    extensions: ['.js', 'json']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
      cleanStaleWebpackAssets: true,
      cleanOnceBeforeBuildPatterns: `${CONFIG.BUILD_FOLDER}/**/*`
    }),
    new CopyPlugin([
      { from: path.resolve(CONFIG.CONTEXT, 'dist/images'), to: path.resolve(CONFIG.OUTPUT, 'dist/images') }
    ]),
    new WebpackAssetsManifest({
      entrypoints: true,
      transform: assets => assets.entrypoints
    }),
    new LodashModuleReplacementPlugin(),
    new MomentLocalesPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: CONFIG.CONTEXT
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: CONFIG.CONTEXT
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              paths: [path.resolve(CONFIG.CONTEXT, 'node_modules')],
              sourceMap: true,
            }
          }
        ]
      },
      {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          loader: 'file-loader',
          options: {
              name: CONFIG.IMG_TEMPLATE_NAME,
              outputPath: CONFIG.IMG_BUILD_FOLDER
          }
      },
      {
          test: /\.(eot|ttf|woff(2)?)$/,
          loader: 'file-loader',
          options: {
              name: CONFIG.FONTS_TEMPLATE_NAME,
              outputPath: CONFIG.FONTS_BUILD_FOLDER
          }
      }
    ]
  },

  optimization: {
    namedModules: true,
    noEmitOnErrors: false,
    runtimeChunk: 'single',
    nodeEnv: process.env.NODE_ENV,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    splitChunks: { // SplitChunksPlugin see https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
      // DEFAULT OPTIONS for cacheGroups
      chunks: 'all', // chunks are generated for async dependencies (requires(), import() etc..) and static imports
      maxInitialRequests: Infinity, // Maximum number of parallel requests at an entrypoint.
      minSize: 0, // min chunk size to be generated
      minChunks: 1, // Minimum number of chunks that must share a module before splitting
      maxAsyncRequests: 5, // Maximum number of parallel requests when on-demand loading.
      automaticNameDelimiter: '~', // By default webpack will generate names using cacheGroup and module name (e.g. vendors~main.js).
      // CACHE GROUPS - rules that combine modules to chunks
      cacheGroups: {
        vendors: { // this will be default rule for libraries that loaded initially
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // return `npm.${packageName.replace('@', '')}`;

            if (packageName.match(/^(react-?.*)|(redux-?.*)$/)) {
              return `npm.react`;
            } else if (packageName.match(/^@hot-loader.*$/)) {
              return `npm.hot-loader`;
            } else if (packageName.match(/^bootstrap.*$/)) {
              return `npm.bootstrap`;
            } else if (packageName.match(/^codemirror$/)) {
              return `npm.codemirror`;
            } else if (packageName.match(/^core-js$/)) {
              return `npm.core-js`;
            } else if (packageName.match(/^jquery$/)) {
              return `npm.jquery`;
            } else if (packageName.match(/^lodash$/)) {
                return `npm.lodash`;
            } else if (packageName.match(/^aws-sdk$/)) {
              return `npm.aws-sdk`;
            } else if (packageName.match(/^(?:nv)?d3$/)) {
              return `npm.nvd3`;
            } else {
              return `npm.vendor`;
            }
          }
        }
      }
    }
  },

  node: {
    crypto: true,
    stream: true
  }
};