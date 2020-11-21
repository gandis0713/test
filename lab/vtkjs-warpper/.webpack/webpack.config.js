const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;
// Plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ENTRY_VTK_EXT = path.join(__dirname, './../src/index.ts');
const SRC_PATH = path.join(__dirname, './../src');
const OUT_PATH = path.join(__dirname, './../dist');

/**
 * `argv` are options from the CLI. They will override our config here if set.
 * `-d` - Development shorthand, sets `debug`, `devtool`, and `mode`
 * `-p` - Production shorthand, sets `minimize`, `NODE_ENV`, and `mode`
 */
module.exports = (env, argv) => {
  const isProdBuild = argv.mode !== 'development';
  const outputFilename = isProdBuild ? '[name].umd.min.js' : '[name].umd.js';

  return {
    entry: {
      index: ENTRY_VTK_EXT,
    },
    devtool: 'source-map',
    output: {
      path: OUT_PATH,
      filename: outputFilename,
      library: '@ewoosoft/es-vtkjs-wrapper',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer('last 2 version', 'ie >= 10')],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          use: ['ts-loader'],
        },
        {
          test: /\.glsl$/,
          exclude: /node_modules/,
          use: ['shader-loader'],
        },
      ].concat(vtkRules),
    },
    resolve: {
      modules: [path.resolve(__dirname, './../node_modules'), SRC_PATH],
      extensions: ['.ts', '.tsx', '.js'],
    },
    externals: [
      // :wave:
      /\b(vtk.js)/,
      // Used to build/load metadata
      {
        //
        react: 'react',
      },
      {
        'gl-matrix': {
          commonjs: 'gl-matrix',
          commonjs2: 'gl-matrix',
          amd: 'gl-matrix',
        },
      },
    ],
    node: {
      // https://github.com/webpack-contrib/style-loader/issues/200
      Buffer: false,
      // Fix for `cornerstone-wado-image-loader` fs dep
      fs: 'empty',
    },
    plugins: [
      // Uncomment to generate bundle analyzer
      // new BundleAnalyzerPlugin(),
      // Show build progress
      new webpack.ProgressPlugin(),
      // Clear dist between builds
      // new CleanWebpackPlugin(),
    ],
  };
};
