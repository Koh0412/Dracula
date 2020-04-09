const path = require('path');
module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map',
  entry: './src/browser/index.ts',
  target: 'electron-renderer',
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './build/src/browser'),
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/, loader: 'ts-loader'
      }
    ]
  }
};