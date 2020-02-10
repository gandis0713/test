const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle_[contenthash].js",
    path: path.resolve(__dirname + "/build"),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve("./build"),
    index: "index.html",
    port: 3000,
    historyApiFallback: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: [ 'babel-loader' ]
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      }
    ].concat(vtkRules)
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CleanWebpackPlugin()
  ]
}