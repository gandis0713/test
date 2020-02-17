import axios from 'axios'

import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'

export default function ReadDicomSeries(Directory, FileNames) {

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("Great success! All the File APIs are supported.");
  }
  const testSeriesDirectory = Directory
  const fileNames = FileNames
  const fetchFiles = fileNames.map(function (file) {
    const path = testSeriesDirectory + file
    const axiosget = axios.get(path, { responseType: 'blob' }).catch(error => {console.log('axios get error');  console.log(error)});
    return axiosget.then(function (response) {
      const jsFile = new window.File([response.data], file)
      return jsFile
    })
    .catch(error => {console.log('axios get then error');  console.log(error)})
  })

  const promissall = Promise.all(fetchFiles).catch(error => {console.log('promiss all error'); console.log(error)});
  
  const promissallthen = promissall.then(function (files) {
    return readImageDICOMFileSeries(null, files)
  }).catch(error => {console.log('promiss all then error'); console.log(error)});
  
  const promissallthenthen = promissallthen.then(function ({ image, webWorker }) {
    webWorker.terminate()
  })
  
  return promissallthenthen
}