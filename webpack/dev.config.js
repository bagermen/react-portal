/*jslint node: true */
"use strict";
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CONFIG = require('./configs');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: CONFIG.OUTPUT,
    hot: true,
    port: 5050,
    host: '0.0.0.0',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '0.0.0.0',
      analyzerPort: 5559
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(CONFIG.CONTEXT, 'index.ejs'),
      title: CONFIG.PORTAL_TITLE,
      mobile: true,
      inject: false,
      base: CONFIG.SERVER_BASE,
      favicon: CONFIG.FAVICON,
      window: {
        config: {
          backend: "http://localhost:8080/",
          appId: "5765521282941492bd81ed90",
          serverURL: "http://localhost:5050/",
          cookieIdentifier: "X-accesstoken-dev"
        }
      }
    })
  ],
  resolve: {
    alias: {
        'react-dom': '@hot-loader/react-dom'
    }
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600,
    poll: 2000
  }
};
