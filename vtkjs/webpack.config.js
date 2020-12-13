const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const glm = require('glm-js');
const vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;

module.exports = {
  entry: './example/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/build'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve('./public'),
    index: 'index.html',
    port: 3000,
    historyApiFallback: true,
    publicPath: 'http://localhost:3000/',
    writeToDisk: true
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: '/node_modules',
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
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
    new CopyWebPackPlugin([
      {
        from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
        to: path.join(__dirname, 'build', 'itk', 'WebWorkers')
      },
      {
        from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
        to: path.join(__dirname, 'build', 'itk', 'ImageIOs')
      }
    ])
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
