const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    devMiddleware: {
      publicPath: '/js/',
    },
    compress: true,
    hot: true,
  },
  resolve: {
    fallback: {
      fs: false,
    },
  },
};
