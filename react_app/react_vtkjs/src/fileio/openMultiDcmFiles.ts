import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import vtkITKHelper from 'vtk.js/Sources/Common/DataModel/ITKHelper';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

const openMultiDcmFiles = (
  files: FileList,
  worker: Worker | null = null
): vtkImageData => {
  console.log(files);
  return new Promise((resolve, reject) => {
    readImageDICOMFileSeries(worker, files)
      .then(function conv({ image, webWorker }) {
        webWorker.terminate();
        const imageData = vtkITKHelper.convertItkToVtkImage(image);
        resolve(imageData);
        console.log(imageData);
      })
      .catch(error => {
        console.log(error);
        reject(new Error('Failed to open File'));
      });
  });
};

export default openMultiDcmFiles;
