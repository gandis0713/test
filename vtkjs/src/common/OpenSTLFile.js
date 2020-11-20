import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openSTLByFile = (file) => {
  console.log(`STL file open by File - ${file.name}`);
  return new Promise((resolve, reject) => {
    const reader = vtkSTLReader.newInstance();
    const fileReader = new FileReader();

    fileReader.onload = function onLoad() {
      reader.parse(fileReader.result);
      const data = reader.getOutputData();
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Failed to open STL Data!'));
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
};

export const openSTLByUrl = (fileUrl) => {
  console.log(`STL file open by URL - ${fileUrl}`);
  return new Promise((resolve, reject) => {
    const reader = vtkSTLReader.newInstance();
    reader
      .setUrl(fileUrl)
      .then(() => {
        const data = reader.getOutputData();
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Failed to open STL Data!'));
        }
      })
      .catch(() => {
        reject(new Error('Failed to open STL Data!'));
      });
  });
};
