const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'v2.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'v2.min.[hash:8].js'
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
      file: path.join(__dirname, 'build', 'index.html'),
      template: path.join(__dirname, 'public', 'index.html')
    })
  ]
}
