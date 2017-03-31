/*eslint no-console:0 */
require('core-js/fn/object/assign');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
  .listen(process.env.PORT, 'localhost', function(err) {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:' + process.env.PORT);
    console.log('Opening your system browser...');
    open('http://localhost:' + process.env.PORT);
  });
