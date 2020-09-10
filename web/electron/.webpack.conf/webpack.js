const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app/index.tsx',
  output: {
    filename: 'index.js',
    path: __dirname + '/../dist',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [],
};
