import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import { VtkDataTypes } from 'vtk.js/Sources/Common/Core/DataArray/Constants';
import { loadDicom, DicomFile } from '@ewoosoft/es-dicom';
import { vec3, vec4, mat4 } from 'gl-matrix';
import { Vector3, VoxelDataArray, IVolumeData, DataType } from '@ewoosoft/es-common-types';

export enum DicomTag {
  // (0002, XXXX)
  FileMetaInformationGroupLength = 'x00020000',
  MediaStorageSOPClassUID = 'x00020002',
  MediaStorageSOPInstanceUID = 'x00020003',
  TransferSyntaxUID = 'x00020010',
  ImplementationClassUID = 'x00020012',
  ImplementationVersionName = 'x00020013',

  // (0008, XXXX)
  SpecificCharacterSet = 'x00080005',
  ImageType = 'x00080008',
  InstanceCreationDate = 'x00080012',
  InstanceCreationTime = 'x00080013',
  InstanceCreationUID = 'x00080014',
  SopClassUID = 'x00080016',
  SopInstanceUID = 'x00080018',
  StudyDate = 'x00080020',
  SeriesDate = 'x00080021',
  AcquistionDate = 'x00080022',
  ContentDate = 'x00080023',
  StudyTime = 'x00080030',
  SeriesTime = 'x00080031',
  AcquistionTime = 'x00080032',
  ContentTime = 'x00080033',
  AccessionNumber = 'x00080050',
  Modality = 'x00080060',
  Manufacturer = 'x00080070',
  InstitutionName = 'x00080080',
  InstitutionAddress = 'x00080081',
  ReferringPhysiciansName = 'x00080090',
  StationName = 'x00081010',
  StudyDescription = 'x00081030',
  SeriesDescription = 'x0008103e',
  ManufacturerModelName = 'x00081090',

  // (0010, XXXX)
  PatientName = 'x00100010',
  PatientID = 'x00100020',
  PatientBirthDate = 'x00100030',
  PatientSex = 'x00100040',
  PatientAge = 'x00101010',
  PatientComments = 'x00104000',

  // (0018, XXXX)
  BodyPartExamined = 'x00180015',
  SliceThickness = 'x00180050',
  KVP = 'x00180060',
  DeviceSerialNumber = 'x00181000',
  SoftwareVersions = 'x00181020',
  ProtocolName = 'x00181030',
  DistanceSourceToDetector = 'x00181110',
  DistanceSourceToPatient = 'x00181111',
  GantryDetectorTilt = 'x00181120',
  TableHeight = 'x00181130',
  ExposureTime = 'x00181150',
  ImageAreaDoseProduct = 'x0018115e',
  XRayTubeCurrent = 'x00181151',
  PatientPosition = 'x00185100',
  XRayTubeCurrentInuA = 'x00188151',

  // (0020, XXXX)
  StudyInstanceUID = 'x0020000d',
  SeriesInstanceUID = 'x0020000e',
  SeriesNumber = 'x00200011',
  AcquisitionNumber = 'x00200012',
  InstanceNumber = 'x00200013',
  ImagePositionPatient = 'x00200032',
  ImageOrientationPatient = 'x00200037',
  FrameOfReferenceUID = 'x00200052',
  PositionReferenceIndicator = 'x00201040',
  SliceLocation = 'x00201041',

  // (0028, XXXX)
  SamplesPerPixel = 'x00280002',
  PhotometricInterpretation = 'x00280004',
  Rows = 'x00280010',
  Columns = 'x00280011',
  PixelSpacing = 'x00280030',
  BitsAllocated = 'x00280100',
  BitsStored = 'x00280101',
  HighBit = 'x00280102',
  PixelRepresentation = 'x00280103',
  WindowCenter = 'x00281050',
  WindowWidth = 'x00281051',
  RescaleIntercept = 'x00281052',
  RescaleSlope = 'x00281053',
  RescaleType = 'x00281054',
}

export interface IResultLoadingDicom {
  data: vtkImageData | null;
  errorCode: number;
  message: string;
}

const CreateVoxelDataArray = (dataType: DataType, size: number): VoxelDataArray => {
  let data: VoxelDataArray = null;
  switch (dataType) {
    case DataType.Int:
      data = new Int16Array(size);
      break;
    case DataType.UnsignedShort:
      data = new Int16Array(size);
      break;
    case DataType.SignedShort:
      data = new Int16Array(size);
      break;
    case DataType.UnsignedChar:
      data = new Uint8Array(size);
      break;
    case DataType.Unknown:
    default:
      data = null;
      break;
  }

  return data;
};

const ConvertDatatypeToVTKDataType = (dataType: DataType): VtkDataTypes => {
  let vtkDatatype: VtkDataTypes = VtkDataTypes.VOID;
  switch (dataType) {
    case DataType.Int:
      vtkDatatype = VtkDataTypes.INT;
      break;
    case DataType.UnsignedShort:
      vtkDatatype = VtkDataTypes.UNSIGNED_SHORT;
      break;
    case DataType.SignedShort:
      vtkDatatype = VtkDataTypes.SHORT;
      break;
    case DataType.UnsignedChar:
      vtkDatatype = VtkDataTypes.UNSIGNED_CHAR;
      break;
    case DataType.Unknown:
    default:
      vtkDatatype = VtkDataTypes.VOID;
      break;
  }

  return vtkDatatype;
};

const ConvertVolumeDataToVTKImageData = (volumeData: IVolumeData): vtkImageData => {
  const imageData = vtkImageData.newInstance();
  imageData.setDimensions(volumeData.dimension);
  imageData.setDirection([1, 0, 0, 0, 0, -1, 0, 1, 0]); // TODO : need to be consider volume orientation.
  imageData.setExtent([
    -(volumeData.dimension[0] - 1) / 2,
    (volumeData.dimension[0] - 1) / 2,
    -(volumeData.dimension[1] - 1) / 2,
    (volumeData.dimension[1] - 1) / 2,
    -(volumeData.dimension[2] - 1) / 2,
    (volumeData.dimension[2] - 1) / 2,
  ]);

  imageData.setSpacing(volumeData.pitch);
  imageData.getPointData().setScalars(
    vtkDataArray.newInstance({
      name: 'volume',
      numberOfComponents: 1,
      dataType: ConvertDatatypeToVTKDataType(volumeData.dataType),
      values: volumeData.voxel,
    })
  );

  return imageData;
};

/**
 * @brief Load dicom files.
 * @param datas list of dicom files or list of dicom url.
 * @param progressCallback number between 0 and 1 is returned.
 * @returns Promise
 *          resolve(vtkImageData)
 *          reject(Error)
 */
const LoadDicomFiles = (
  datas: FileList | string[],
  progressCallback: Function
): Promise<vtkImageData> => {
  return new Promise((resolve, reject) => {
    if (datas.length < 1) {
      return;
    }

    const dicomCount = datas.length;
    const promises: Promise<DicomFile>[] = new Array(datas.length);
    for (let i = 0; i < dicomCount; i += 1) {
      promises[i] = new Promise((resolveLoadDicom, rejectLoadDicom) => {
        loadDicom(datas[i])
          .then((dicom: DicomFile): void => {
            resolveLoadDicom(dicom);
          })
          .catch((e): void => {
            console.debug('Failed to load dicom file. index : ', i);
            rejectLoadDicom(e);
          });
      });
    }

    let loadDicomSuccessCount = 0;
    let loadDicomFailCount = 0;

    let progress = 0;
    const dicomLoadProgressRatio = 0.5;
    const setVolumeDataProgressRatio = 0.49;
    const convertToVTKDataProgressRatio = 0.01;

    const imagePositionMin: Vector3 = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ];
    const imagePositionMax: Vector3 = [
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ];

    let minPixelValue = Number.MAX_SAFE_INTEGER;
    let maxPixelValue = Number.MAX_SAFE_INTEGER;

    const volumeData: IVolumeData = {
      studyUID: '',
      accessionNumber: '',
      seriesUID: '',
      seriesNumber: '',
      deviceName: '',
      dimension: [0, 0, 0],
      pitch: [0, 0, 0],
      imageOrientationX: [0, 0, 0],
      imageOrientationY: [0, 0, 0],
      imageOrientationZ: [0, 0, 0],
      dataType: DataType.Int,
      defaultWindowingWidth: 0,
      defaultWindowingLevel: 0,
      minValue: Number.MAX_SAFE_INTEGER,
      maxValue: Number.MIN_SAFE_INTEGER,
      intercept: 0,
      slope: 0,
      voxel: null,
    };

    const result: IResultLoadingDicom = {
      data: null,
      errorCode: 0,
      message: '',
    };

    const dicomList: DicomFile[] = [];

    const createVolumeData = (): void => {
      if (loadDicomSuccessCount < 1) {
        reject(new Error('there is no loaded dicom.'));
        return;
      }

      // set dicom common value using first loaded dicom.
      {
        volumeData.studyUID = dicomList[0].getTag(DicomTag.StudyInstanceUID);
        volumeData.accessionNumber = dicomList[0].getTag(DicomTag.AccessionNumber);
        volumeData.seriesUID = dicomList[0].getTag(DicomTag.SeriesInstanceUID);
        volumeData.seriesNumber = dicomList[0].getTag(DicomTag.SeriesNumber);
        volumeData.deviceName = dicomList[0].getTag(DicomTag.StationName);
        volumeData.intercept = Number(dicomList[0].intercept);
        volumeData.slope = Number(dicomList[0].slope);
        volumeData.defaultWindowingWidth = dicomList[0].windowWidth;
        volumeData.defaultWindowingLevel = dicomList[0].windowCenter;
        volumeData.dataType = DataType.Int; // import Int16Array pixel data from dicom file.

        // orientation
        const imageOrientationPatient = dicomList[0]
          .getTag(DicomTag.ImageOrientationPatient)
          .split('\\');
        volumeData.imageOrientationX[0] = Number(imageOrientationPatient[0]);
        volumeData.imageOrientationX[1] = Number(imageOrientationPatient[1]);
        volumeData.imageOrientationX[2] = Number(imageOrientationPatient[2]);

        volumeData.imageOrientationY[0] = Number(imageOrientationPatient[3]);
        volumeData.imageOrientationY[1] = Number(imageOrientationPatient[4]);
        volumeData.imageOrientationY[2] = Number(imageOrientationPatient[5]);

        // spacing
        const pixelSpacing = dicomList[0].getTag(DicomTag.PixelSpacing).split('\\');
        volumeData.pitch[0] = Number(pixelSpacing[0]);
        volumeData.pitch[1] = Number(pixelSpacing[1]);
        volumeData.pitch[2] = Number(dicomList[0].getTag(DicomTag.SliceThickness));

        // dimension
        volumeData.dimension[0] = dicomList[0].getTag(DicomTag.Columns);
        volumeData.dimension[1] = dicomList[0].getTag(DicomTag.Rows);
        volumeData.dimension[2] = 0;

        // voxel min and max value
        volumeData.minValue = minPixelValue;
        volumeData.maxValue = maxPixelValue;
      }

      const volumeIndexOrigin: Vector3 = [0, 0, 0];
      // set values that related voxel.
      if (loadDicomSuccessCount > 1) {
        const imagePositionDiff: Vector3 = [0, 0, 0];
        imagePositionDiff[0] = imagePositionMax[0] - imagePositionMin[0];
        imagePositionDiff[1] = imagePositionMax[1] - imagePositionMin[1];
        imagePositionDiff[2] = imagePositionMax[2] - imagePositionMin[2];

        // set Z Axis orientation
        vec3.normalize(volumeData.imageOrientationZ, imagePositionDiff);

        // set Z Axis dimension
        volumeData.dimension[2] = Math.round(vec3.length(imagePositionDiff) / volumeData.pitch[2]);

        // set index origin
        volumeIndexOrigin[0] = Math.round(imagePositionMin[0] / volumeData.pitch[2]);
        volumeIndexOrigin[1] = Math.round(imagePositionMin[1] / volumeData.pitch[2]);
        volumeIndexOrigin[2] = Math.round(imagePositionMin[2] / volumeData.pitch[2]);
      }

      // create voxel data array.
      volumeData.voxel = CreateVoxelDataArray(
        volumeData.dataType,
        volumeData.dimension[0] * volumeData.dimension[1] * volumeData.dimension[2]
      );

      // create voxel orientation matrix.
      const matVoxelOrientation: mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      matVoxelOrientation[0] = volumeData.imageOrientationX[0] * volumeData.pitch[0];
      matVoxelOrientation[1] = volumeData.imageOrientationX[1] * volumeData.pitch[0];
      matVoxelOrientation[2] = volumeData.imageOrientationX[2] * volumeData.pitch[0];

      matVoxelOrientation[4] = volumeData.imageOrientationY[0] * volumeData.pitch[1];
      matVoxelOrientation[5] = volumeData.imageOrientationY[1] * volumeData.pitch[1];
      matVoxelOrientation[6] = volumeData.imageOrientationY[2] * volumeData.pitch[1];

      // set data min and max value.
      for (let i = 0; i < dicomList.length; i += 1) {
        const imgPositionPatient = dicomList[i].getTag(DicomTag.ImagePositionPatient).split('\\');

        // set image position value of voxel orientation matrix.
        matVoxelOrientation[12] = Number(imgPositionPatient[0]);
        matVoxelOrientation[13] = Number(imgPositionPatient[1]);
        matVoxelOrientation[14] = Number(imgPositionPatient[2]);

        const pixelData = dicomList[i].getPixelData();
        const pixelPosition: vec4 = [0, 0, 0, 1];
        if (volumeData.voxel) {
          for (let rowIndex = 0; rowIndex < volumeData.dimension[1]; rowIndex += 1) {
            for (let columnIndex = 0; columnIndex < volumeData.dimension[0]; columnIndex += 1) {
              vec4.transformMat4(pixelPosition, [columnIndex, rowIndex, 0, 1], matVoxelOrientation);

              // change real pixel position to indexted position.
              pixelPosition[0] =
                Math.round(pixelPosition[0] / volumeData.pitch[0]) - volumeIndexOrigin[0];
              pixelPosition[1] =
                Math.round(pixelPosition[1] / volumeData.pitch[1]) - volumeIndexOrigin[1];
              pixelPosition[2] =
                Math.round(pixelPosition[2] / volumeData.pitch[2]) - volumeIndexOrigin[2];

              // set voxel data to each indexed position.
              volumeData.voxel[
                pixelPosition[0] +
                  pixelPosition[1] * volumeData.dimension[0] +
                  pixelPosition[2] * volumeData.dimension[1] * volumeData.dimension[0]
              ] = pixelData[rowIndex * volumeData.dimension[0] + columnIndex];
            }
          }
        }

        progress += setVolumeDataProgressRatio / dicomList.length;
        progressCallback(progress);
      }

      const imageData: vtkImageData = ConvertVolumeDataToVTKImageData(volumeData);
      result.data = imageData;

      progress += convertToVTKDataProgressRatio / 1;
      progressCallback(progress);

      // set result state.
      if (loadDicomFailCount > 0) {
        result.errorCode = -1;
        result.message = 'Failed to load some dicom files.';
      }

      resolve(result);
    };

    for (let i = 0; i < dicomCount; i += 1) {
      promises[i]
        // eslint-disable-next-line no-loop-func
        .then((dicom: DicomFile) => {
          dicomList.push(dicom);

          // caculate min and max value.
          {
            // set image position min and max.
            const imagePositionPatient = dicom.getTag(DicomTag.ImagePositionPatient).split('\\');
            const imagePosition: Vector3 = [0, 0, 0];
            imagePosition[0] = Number(imagePositionPatient[0]);
            imagePosition[1] = Number(imagePositionPatient[1]);
            imagePosition[2] = Number(imagePositionPatient[2]);
            for (let index = 0; index < 3; index += 1) {
              imagePositionMin[index] =
                imagePositionMin[index] > imagePosition[index]
                  ? imagePosition[index]
                  : imagePositionMin[index];
              imagePositionMax[index] =
                imagePositionMax[index] < imagePosition[index]
                  ? imagePosition[index]
                  : imagePositionMax[index];
            }

            // set pixel min and max.
            const pixel = dicom.getPixelData();
            for (let j = 0; j < pixel.length; j += 1) {
              minPixelValue = pixel[j] < minPixelValue ? pixel[j] : minPixelValue;
              maxPixelValue = pixel[j] > maxPixelValue ? pixel[j] : maxPixelValue;
            }
          }
          loadDicomSuccessCount += 1;

          progress += dicomLoadProgressRatio / dicomCount;
          progressCallback(progress);
          if (loadDicomFailCount + loadDicomSuccessCount === dicomCount) {
            createVolumeData();
          }
        })
        // eslint-disable-next-line no-loop-func
        .catch((): void => {
          loadDicomFailCount += 1;

          progress += dicomLoadProgressRatio / dicomCount;
          progressCallback(progress);
          if (loadDicomFailCount + loadDicomSuccessCount === dicomCount) {
            createVolumeData();
          }
        });
    }
  });
};

export { LoadDicomFiles };
