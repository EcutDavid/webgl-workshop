var path = require('path');

var srcPath = path.join(__dirname, '/../src');

module.exports = {
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../docs/assets'),
    filename: process.env.REACT_WEBPACK_ENV === 'dist' ? 'app[hash].js' : 'app.js',
    publicPath: './assets/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      actions: srcPath + '/actions/',
      components: srcPath + '/components/',
      sources: srcPath + '/sources/',
      stores: srcPath + '/stores/',
      styles: srcPath + '/styles/'
    }
  },
  module: {}
};
