#include "mainwindow.h"
#include <QApplication>

#include <vtkGenericOpenGLRenderWindow.h>
#include <vtkSTLReader.h>
#include <vtkPolyDataMapper.h>

#include <vtkVersion.h>
#include <vtkSmartPointer.h>
#include <vtkPolyData.h>
#include <vtkImageData.h>
#include <vtkSphereSource.h>
#include <vtkMetaImageWriter.h>
#include <vtkPolyDataToImageStencil.h>
#include <vtkImageStencil.h>
#include <vtkPointData.h>
#include <vtkSmartVolumeMapper.h>
#include <vtkVolumeProperty.h>

#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderer.h>

#include <QVTKOpenGLWidget.h>

// added below code to handle the vtkPolyDataMapper error.
#include <vtkAutoInit.h>
VTK_MODULE_INIT(vtkRenderingOpenGL2);
VTK_MODULE_INIT(vtkInteractionStyle);
/* reference :
 * https://stackoverflow.com/questions/18642155/no-override-found-for-vtkpolydatamapper
 */


int main(int argc, char *argv[])
{
//    if ( argc != 2 )
//    {
//        cout << "Required argument as STL file path to load" << endl;
//        return -1;
//    }
//    std::string inputFilename = argv[1];

    QApplication app(argc, argv);
    // create widget
    QVTKOpenGLWidget widget;
    widget.resize(256,256);

    // create window for rendering
    vtkNew<vtkGenericOpenGLRenderWindow> renderWindow;

    // set rendering window to widget.
    widget.SetRenderWindow(renderWindow);

    // create STL Reader and set STL file.
    vtkSmartPointer<vtkSphereSource> sphereSource =
      vtkSmartPointer<vtkSphereSource>::New();
    sphereSource->SetRadius(20);
    sphereSource->SetPhiResolution(30);
    sphereSource->SetThetaResolution(30);
    vtkSmartPointer<vtkPolyData> pd = sphereSource->GetOutput();
    sphereSource->Update();

    vtkSmartPointer<vtkImageData> whiteImage =
      vtkSmartPointer<vtkImageData>::New();
    double bounds[6];
    pd->GetBounds(bounds);
    double spacing[3]; // desired volume spacing
    spacing[0] = 0.5;
    spacing[1] = 0.5;
    spacing[2] = 0.5;
    whiteImage->SetSpacing(spacing);

    // compute dimensions
    int dim[3];
    for (int i = 0; i < 3; i++)
      {
      dim[i] = static_cast<int>(ceil((bounds[i * 2 + 1] - bounds[i * 2]) / spacing[i]));
      }
    whiteImage->SetDimensions(dim);
    whiteImage->SetExtent(0, dim[0] - 1, 0, dim[1] - 1, 0, dim[2] - 1);

    double origin[3];
    origin[0] = bounds[0] + spacing[0] / 2;
    origin[1] = bounds[2] + spacing[1] / 2;
    origin[2] = bounds[4] + spacing[2] / 2;
    whiteImage->SetOrigin(origin);

  #if VTK_MAJOR_VERSION <= 5
    whiteImage->SetScalarTypeToUnsignedChar();
    whiteImage->AllocateScalars();
  #else
    whiteImage->AllocateScalars(VTK_UNSIGNED_CHAR,1);
  #endif
    // fill the image with foreground voxels:
    unsigned char inval = 255;
    unsigned char outval = 0;
    vtkIdType count = whiteImage->GetNumberOfPoints();
    for (vtkIdType i = 0; i < count; ++i)
      {
      whiteImage->GetPointData()->GetScalars()->SetTuple1(i, inval);
      }

    // polygonal data --> image stencil:
    vtkSmartPointer<vtkPolyDataToImageStencil> pol2stenc =
      vtkSmartPointer<vtkPolyDataToImageStencil>::New();

    pol2stenc->SetInputData(pd);
    pol2stenc->SetOutputOrigin(origin);
    pol2stenc->SetOutputSpacing(spacing);
    pol2stenc->SetOutputWholeExtent(whiteImage->GetExtent());
    pol2stenc->Update();

    // cut the corresponding white image and set the background:
    vtkSmartPointer<vtkImageStencil> imgstenc =
      vtkSmartPointer<vtkImageStencil>::New();

    imgstenc->SetInputData(whiteImage);
    imgstenc->SetStencilConnection(pol2stenc->GetOutputPort());
    imgstenc->ReverseStencilOff();
    imgstenc->SetBackgroundValue(outval);
    imgstenc->Update();

    vtkSmartPointer<vtkSmartVolumeMapper> volumeMapper =
      vtkSmartPointer<vtkSmartVolumeMapper>::New();
    volumeMapper->SetBlendModeToComposite(); // composite first
    volumeMapper->SetInputData(imgstenc->GetOutput());

    vtkSmartPointer<vtkVolumeProperty> volumeProperty =
      vtkSmartPointer<vtkVolumeProperty>::New();
    volumeProperty->ShadeOff();
    volumeProperty->SetInterpolationType(VTK_LINEAR_INTERPOLATION);

    vtkSmartPointer<vtkVolume> volume =
      vtkSmartPointer<vtkVolume>::New();
    volume->SetMapper(volumeMapper);
    volume->SetProperty(volumeProperty);

    // create renderer and set actor to renderer
    vtkSmartPointer<vtkRenderer> renderer =
      vtkSmartPointer<vtkRenderer>::New();
    renderer->AddViewProp(volume);
    renderer->ResetCamera();

    // render window
    renderWindow->AddRenderer(renderer);
    renderWindow->Render();

    // show widget
    widget.show();


    return 0;
}
