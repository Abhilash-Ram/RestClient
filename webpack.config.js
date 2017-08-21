'use strict';

var webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app:'./src/js/index.js',
    vendor:["angular"]
  },
  plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'WebService Handler'
      })
    ],
  output: {
    path: __dirname + '/js',
    filename: 'app.bundle.js'
  },
   module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }]
    },
    plugins:[
      new HtmlWebpackPlugin({
      template: 'src/app.html'
      }),
        new webpack.optimize.CommonsChunkPlugin({name : "vendor", filename : "vendor.bundle.js"})
    ]
};