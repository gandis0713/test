import readImageFile from 'itk/readImageFile';
import vtkITKHelper from 'vtk.js/Sources/Common/DataModel/ITKHelper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openImageFile = (file: File): any => {
  console.log(`file open - ${file}`);
  return new Promise((resolve, reject) => {
    readImageFile(null, file)
      .then(function conv({ image, webWorker }) {
        webWorker.terminate();
        const imageData = vtkITKHelper.convertItkToVtkImage(image);
        // /const is3D = itkImage.imageType.dimension === 3 && !use2D;
        resolve(imageData);
        console.log(`succeed to open image: ${imageData}`);
      })
      .catch(error => {
        console.log(error);
        reject(new Error('Failed to open File'));
      });
  });
};

export default openImageFile;
