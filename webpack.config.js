const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'v2.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'v2.min.[fullhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, 'public', 'assets'), to: path.join(__dirname, 'build', 'assets') }]
    })
  ]
}
