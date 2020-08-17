const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    "index.html": "./public/index.html",
  },
  devServer: {
    contentBase: path.resolve("./public"),
    index: "index.html",
    port: 3000,
    historyApiFallback: true,
    publicPath: 'http://localhost:3000/',
    writeToDisk: true,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ]
}