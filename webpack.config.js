const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/v2.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'v2.min.[fullhash].js'
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
      template: './public/index.html',
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer',
      minify: true
    }),
    new CopyPlugin({
      patterns: [{ from: './public/assets', to: './assets' }]
    })
  ]
}
