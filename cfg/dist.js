var path = require('path');
var webpack = require('webpack');

var baseConfig = require('./base');
var defaultSettings = require('./defaults');

// Add needed plugins here
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      filename: '../index.html',
      template: 'src/index.html.template'
    })
  ],
  module: defaultSettings.getDefaultModules()
});

module.exports = config;
