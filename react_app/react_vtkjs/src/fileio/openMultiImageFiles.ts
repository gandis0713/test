import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries';
import vtkITKHelper from 'vtk.js/Sources/Common/DataModel/ITKHelper';

const openMultiImageFiles = (files: FileList): any => {
  console.log(files);
  return new Promise((resolve, reject) => {
    readImageDICOMFileSeries(null, files)
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

export default openMultiImageFiles;
