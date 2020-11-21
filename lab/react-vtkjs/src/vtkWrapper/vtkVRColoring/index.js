import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

const transFuncTeeth = vtkColorTransferFunction.newInstance();
transFuncTeeth.addRGBPoint(-1000, 0, 0, 0);
transFuncTeeth.addRGBPoint(320, 0.522, 0.078, 0.09);
transFuncTeeth.addRGBPoint(1760, 0.859, 0.667, 0.294);
transFuncTeeth.addRGBPoint(2800, 1.0, 1.0, 1.0);
transFuncTeeth.addRGBPoint(3000, 1.0, 1.0, 1.0);
const opaFuncTeeth = vtkPiecewiseFunction.newInstance();
opaFuncTeeth.addPoint(560, 0.0);
opaFuncTeeth.addPoint(1731, 0.3274);
opaFuncTeeth.addPoint(3000, 0.42391);

const transFuncBone = vtkColorTransferFunction.newInstance();
transFuncBone.addRGBPoint(-1000, 0, 0, 0);
transFuncBone.addRGBPoint(788, 0.627, 0.102, 0.086);
transFuncBone.addRGBPoint(1090, 0.992, 0.886, 0.576);
transFuncBone.addRGBPoint(1247, 1, 1, 1);
transFuncBone.addRGBPoint(3000, 1, 1, 1);
const opaFuncBone = vtkPiecewiseFunction.newInstance();
opaFuncBone.addPoint(752, 0.0);
opaFuncBone.addPoint(1151, 0.71304);
opaFuncBone.addPoint(3000, 1.0);

const transFuncMIP = vtkColorTransferFunction.newInstance();
transFuncMIP.addRGBPoint(-1250, 0, 0, 0);
transFuncMIP.addRGBPoint(4250, 1, 1, 1);
const opaFuncMIP = vtkPiecewiseFunction.newInstance();
opaFuncMIP.addPoint(-1250, 1);
opaFuncMIP.addPoint(4250, 1);

export const VRColoringType = {
  teeth: 'Teeth',
  bone: 'Bone',
  mip: 'MIP'
}

const VRColoring = {
  Teeth: {
    color: transFuncTeeth,
    opacity: opaFuncTeeth,
  },
  Bone: {
    color: transFuncBone,
    opacity: opaFuncBone,
  },
  MIP: {
    color: transFuncMIP,
    opacity: opaFuncMIP,
  }
}

export default VRColoring;