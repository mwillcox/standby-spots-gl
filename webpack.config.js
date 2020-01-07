const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
   },
   plugins: [
    new HtmlWebpackPlugin({
      // injects bundle.js to our new index.html
      inject: true,
      // copys the content of the existing index.html to the new /build index.html
      template:  path.resolve('./index.html'),
    }),
  ]
};