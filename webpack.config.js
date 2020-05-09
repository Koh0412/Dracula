const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin(
      {
        configFile: './src/browser/tsconfig.json'
      }
    )]
  },
  module: {
    rules: [
      {
        test: /\.ts$/, loader: 'ts-loader'
      }
    ]
  }
};