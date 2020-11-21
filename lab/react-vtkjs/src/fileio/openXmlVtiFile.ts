import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

const openXmlVtiFile = (url: string): vtkImageData => {
  console.log(url);
  return new Promise((resolve, reject) => {
    const reader = vtkXMLImageDataReader.newInstance();
    reader
      .setUrl(url, { loadData: true })
      .then(() => {
        const data = reader.getOutputData();
        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });
};

export default openXmlVtiFile;
