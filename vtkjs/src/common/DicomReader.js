import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';

const openXmlVtiFile = url => {
  return new Promise((resolve, reject) => {
    const reader = vtkXMLImageDataReader.newInstance();
    reader
      .setUrl(url, { loadData: true })
      .then(() => {
        const imageData = reader.getOutputData();
        resolve(imageData);
      })
      .catch(() => {
        reject();
      });
  });
};

export default openXmlVtiFile;
