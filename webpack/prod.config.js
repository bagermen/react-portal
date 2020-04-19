/*jslint node: true */
"use strict";
const path = require('path');
const CONFIG = require('./configs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        exclude: [],
        sourceMap: true,
        terserOptions: {
          warnings: false,
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${CONFIG.CSS_BUILD_FOLDER}/${CONFIG.CSS_TEMPLATE_NAME}`
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
  ]
};
