var path = require('path');

function getDefaultModules() {
  return {
    loaders: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }, {
        test: /\.scss/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader'
          }, {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded'
            }
          }
        ]
      }, {
        test: /\.(png|jpg|gif|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }, {
        test: /\.(mp4|ogg|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader'
        ]
      }, {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        include: path.join(__dirname, '/../src')
      }
    ]
  };
}
module.exports = {
  getDefaultModules: getDefaultModules
};
