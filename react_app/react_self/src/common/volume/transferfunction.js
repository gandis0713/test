import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

export let TransferFunction = new Map();

TransferFunction.set('Teeth', {
    Opacity : function() {
        const ofun = vtkPiecewiseFunction.newInstance();
        ofun.addPoint(560, 0.0);
        ofun.addPoint(1731, 0.16174);
        ofun.addPoint(3000, 0.21391);
        return ofun;
    },
    Color : function() {
        const ctfun = vtkColorTransferFunction.newInstance();
        ctfun.addRGBPoint(-1000, 0, 0, 0);
        ctfun.addRGBPoint(320, 0.5, 0.08, 0.1);
        ctfun.addRGBPoint(1760, 0.85, 0.7, 0.3);
        ctfun.addRGBPoint(2800, 1, 1, 1);
        ctfun.addRGBPoint(3000, 1, 1, 1);
        return ctfun;
    }
})

TransferFunction.set('Bone', {
    Opacity : function() {
        const ofun = vtkPiecewiseFunction.newInstance();
        ofun.addPoint(752, 0.0);
        ofun.addPoint(1151, 0.71304);
        ofun.addPoint(3000, 1.0);
        return ofun;
    },
    Color : function() {
        const ctfun = vtkColorTransferFunction.newInstance();
        ctfun.addRGBPoint(-1000, 0, 0, 0);
        ctfun.addRGBPoint(788, 0.627, 0.102, 0.086);
        ctfun.addRGBPoint(1090, 0.992, 0.886, 0.576);
        ctfun.addRGBPoint(1247, 1, 1, 1);
        ctfun.addRGBPoint(3000, 1, 1, 1);
        return ctfun;
    }
})
