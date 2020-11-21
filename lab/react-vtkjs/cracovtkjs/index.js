// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loaderByName, addBeforeLoader } = require('@craco/craco');

module.exports = () => ({
  overrideWebpackConfig: ({ webpackConfig }) => {
    const shaderLoader = { test: /\.glsl$/, use: ['shader-loader'] };
    addBeforeLoader(webpackConfig, loaderByName('file-loader'), shaderLoader);

    const workerLoader = {
      test: /\.worker\.js/,
      use: [{ loader: 'worker-loader', options: { inline: true, fallback: false } }]
    };
    addBeforeLoader(webpackConfig, loaderByName('babel-loader'), workerLoader);

    const jsLoader = {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    };

    addBeforeLoader(webpackConfig, loaderByName('babel-loader'), jsLoader);

    return webpackConfig;
  }
});
