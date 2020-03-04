// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoVtkPlugin = require("craco-vtk");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoItkPlugin = require("craco-itk");

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
