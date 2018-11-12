
#include <vtkTransformPolyDataFilter.h>
#include <vtkTransform.h>
#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkVersion.h>
#include <vtkImageData.h>
#include <vtkImageStencil.h>
#include <vtkPolyDataToImageStencil.h>
#include <vtkPolyData.h>
#include <vtkSmartPointer.h>
#include <vtkRenderer.h>
#include <vtkImageActor.h>
#include <vtkImageMapper3D.h>
#include <vtkPointData.h>

#include <vtkCylinderSource.h>
#include <vtkSphereSource.h>

#include <iostream>

using namespace std;

#define RADIUS       3.0
#define RESOLUTION   200


//#define CIRCLE       1


int main(int, char *[])
{
#ifdef CIRCLE
	//Create a circle
	vtkSmartPointer<vtkCylinderSource> polygonSource =
		vtkSmartPointer<vtkCylinderSource>::New();
	polygonSource->SetCenter(0.0, 0.0, 0.0);
	polygonSource->SetRadius(RADIUS);
	polygonSource->SetHeight(0.5);
	polygonSource->SetResolution(RESOLUTION);
#else
	// Create a sphere
	vtkSmartPointer<vtkSphereSource> polygonSource =
		vtkSmartPointer<vtkSphereSource>::New();
	polygonSource->SetRadius(RADIUS);
	polygonSource->SetPhiResolution(RESOLUTION);
	polygonSource->SetThetaResolution(RESOLUTION);
#endif // CIRCLE





	// Set rotation.
	vtkSmartPointer<vtkTransform> transform = vtkSmartPointer<vtkTransform>::New();
  transform->RotateWXYZ(0, 1, 0, 0);

  vtkSmartPointer<vtkTransformPolyDataFilter> transformFilter =
	  vtkSmartPointer<vtkTransformPolyDataFilter>::New();

  transformFilter->SetTransform(transform);
  transformFilter->SetInputConnection(polygonSource->GetOutputPort());
  transformFilter->Update();

  //Create a mapper and actor
  vtkSmartPointer<vtkPolyData> polydata = transformFilter->GetOutput();

  vtkSmartPointer<vtkImageData> whiteImage =
	  vtkSmartPointer<vtkImageData>::New();
  double dBounds[6];
  polydata->GetBounds(dBounds);

  double spacing[3]; // desired volume spacing
  spacing[0] = 0.5;
  spacing[1] = 0.5;
  spacing[2] = 0.5;
  whiteImage->SetSpacing(spacing);

  // compute dimensions
  int dim[3];
  for (int i = 0; i < 3; i++)
  {
	  dim[i] = static_cast<int>(ceil((dBounds[i * 2 + 1] - dBounds[i * 2]) / spacing[i]));
  }
  whiteImage->SetDimensions(dim);
  whiteImage->SetExtent(0, dim[0] - 1, 0, dim[1] - 1, 0, dim[2] - 1);

  double origin[3];
  origin[0] = dBounds[0] + spacing[0] / 2;
  origin[1] = dBounds[2] + spacing[1] / 2;
  origin[2] = dBounds[4] + spacing[2] / 2;
  whiteImage->SetOrigin(origin);
  whiteImage->AllocateScalars(VTK_UNSIGNED_CHAR, 1);

  // fill the image with foreground voxels:
  unsigned char inval = 1;
  unsigned char outval = 0;
  vtkIdType count = whiteImage->GetNumberOfPoints();
  for (vtkIdType i = 0; i < count; ++i)
  {
	  whiteImage->GetPointData()->GetScalars()->SetTuple1(i, inval);
  }

  // polygonal data --> image stencil:
  vtkSmartPointer<vtkPolyDataToImageStencil> pol2stenc =
	  vtkSmartPointer<vtkPolyDataToImageStencil>::New();
  pol2stenc->SetInputData(polydata);
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

  //show shape in terminal
  unsigned char* value = NULL;
  value = (unsigned char*)imgstenc->GetOutput()->GetScalarPointer();
  for (int k = 0; k < dim[2]; k++)
  {
	  for (int j = 0; j < dim[1]; j++)
	  {
		  for (int i = 0; i < dim[0]; i++)
		  {
			  int index = (k * dim[1] * dim[0]) + (j * dim[0]) +  i;
			  cout << (int)value[index] << "  ";
		  }
		  cout << endl;
	  }
	  cout << endl;
  }
  cout << "min x : " << dBounds[0] << ", y : " << dBounds[2] << ", z : " << dBounds[4] << endl;
  cout << "max x : " << dBounds[1] << ", y : " << dBounds[3] << ", z : " << dBounds[5] << endl;
  cout << "dim x : " << dim[0] << ", y : " << dim[1] << ", z : " << dim[2] << endl;

  // Create an actor
  vtkSmartPointer<vtkImageActor> actor = vtkSmartPointer<vtkImageActor>::New();
  actor->GetMapper()->SetInputConnection(imgstenc->GetOutputPort());

  //Create a renderer, render window, and interactor
  vtkSmartPointer<vtkRenderer> renderer =
    vtkSmartPointer<vtkRenderer>::New();
  vtkSmartPointer<vtkRenderWindow> renderWindow =
    vtkSmartPointer<vtkRenderWindow>::New();
  renderWindow->AddRenderer(renderer);
  vtkSmartPointer<vtkRenderWindowInteractor> renderWindowInteractor =
    vtkSmartPointer<vtkRenderWindowInteractor>::New();
  renderWindowInteractor->SetRenderWindow(renderWindow);

  //Add the actors to the scene
  renderer->AddActor(actor);
  renderer->SetBackground(.3, .2, .1); // Background color dark red

  //Render and interact
  renderWindow->Render();
  renderWindowInteractor->Start();
  
  return EXIT_SUCCESS;
}
