import axios from 'axios'

import IntTypes from 'itk/IntTypes'
import PixelTypes from 'itk/PixelTypes'
import readImageDICOMFileSeries from 'itk/readImageDICOMFileSeries'

import getMatrixElement from 'itk/getMatrixElement'

export default function ReadDicomSeries(Directory, FileNames) {

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("Great success! All the File APIs are supported.");
  }
  const testSeriesDirectory = Directory
  const fileNames = FileNames
  const fetchFiles = fileNames.map(function (file) {
    const path = testSeriesDirectory + file
    console.log(path)
    const axiosget = axios.get(path).catch(error => {console.log('axios get error');  console.log(error)});
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
    t.is(image.imageType.dimension, 3, 'dimension')
    t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], -17.3551, 'origin[0]')
    t.is(image.origin[1], -133.9286, 'origin[1]')
    t.is(image.origin[2], 116.7857, 'origin[2]')
    t.is(image.spacing[0], 1.0, 'spacing[0]')
    t.is(image.spacing[1], 1.0, 'spacing[1]')
    t.is(image.spacing[2], 1.3000000000000007, 'spacing[2]')
    t.is(getMatrixElement(image.direction, 0, 0), 0.0, 'direction (0, 0)')
    t.is(getMatrixElement(image.direction, 0, 1), 0.0, 'direction (0, 1)')
    t.is(getMatrixElement(image.direction, 0, 2), -1.0, 'direction (0, 2)')
    t.is(getMatrixElement(image.direction, 1, 0), 1.0, 'direction (1, 0)')
    t.is(getMatrixElement(image.direction, 1, 1), 0.0, 'direction (1, 1)')
    t.is(getMatrixElement(image.direction, 1, 2), 0.0, 'direction (1, 2)')
    t.is(getMatrixElement(image.direction, 2, 0), 0.0, 'direction (2, 0)')
    t.is(getMatrixElement(image.direction, 2, 1), -1.0, 'direction (2, 1)')
    t.is(getMatrixElement(image.direction, 2, 2), 0.0, 'direction (2, 2)')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.size[2], 3, 'size[2]')
    t.is(image.data.length, 3 * 65536, 'data.length')
    t.is(image.data[1000], 5, 'data[1000]')
    t.end()

  })
  
  return promissallthenthen
}