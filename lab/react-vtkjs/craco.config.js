// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoItkPlugin = require('craco-itk');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoVtkPlugin = require('./cracovtkjs/index');

module.exports = {
  plugins: [
    {
      plugin: CracoVtkPlugin()
    },
    {
      plugin: CracoItkPlugin()
    }
  ]
};
