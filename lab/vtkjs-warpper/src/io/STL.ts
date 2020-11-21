import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

const LoadSTLByFile = (file: File): vtkPolyData => {
  return new Promise((resolve, reject) => {
    const reader = vtkSTLReader.newInstance();
    const fileReader = new FileReader();

    fileReader.onload = function onLoad(): void {
      reader.parse(fileReader.result);
      const polydata = reader.getOutputData();
      if (polydata) {
        resolve(polydata);
      } else {
        reject(new Error('Loaded STL Data by file is null or undefined.'));
      }
    };

    fileReader.onerror = (): void => {
      reject(new Error(`Failed to load STL, file : ${file.name}`));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

const LoadSTLByUrl = (url: string): vtkPolyData => {
  return new Promise((resolve, reject) => {
    const reader = vtkSTLReader.newInstance();
    reader
      .setUrl(url)
      .then(() => {
        const polydata = reader.getOutputData();
        if (polydata) {
          resolve(polydata);
        } else {
          reject(new Error('Loaded STL Data by url is null or undefined.'));
        }
      })
      .catch(() => {
        reject(new Error('Failed to load STL Data.'));
      });
  });
};

const LoadSTL = (data: string | File): vtkPolyData => {
  return new Promise((resolve, reject) => {
    if (typeof data === 'string') {
      // URL type
      LoadSTLByUrl(data)
        .then((polydata: vtkPolyData) => {
          resolve(polydata);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (data.name !== undefined) {
      // file type
      LoadSTLByFile(data)
        .then((polydata: vtkPolyData) => {
          resolve(polydata);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(new Error('Unknown data type.'));
    }
  });
};

export default LoadSTL;
