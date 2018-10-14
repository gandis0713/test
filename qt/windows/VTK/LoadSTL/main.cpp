#include "mainwindow.h"
#include <QApplication>

//#include <vtkGenericOpenGLRenderWindow.h>
//#include <vtkRenderer.h>
//#include <vtkSTLReader.h>
//#include <vtkPolyDataMapper.h>

//#include <QVTKOpenGLWidget.h>

//// added below code to handle the vtkPolyDataMapper error.
//#include <vtkAutoInit.h>
//VTK_MODULE_INIT(vtkRenderingOpenGL2);
//VTK_MODULE_INIT(vtkInteractionStyle);
///* reference :
// * https://stackoverflow.com/questions/18642155/no-override-found-for-vtkpolydatamapper
// */


int main(int argc, char *argv[])
{    
//    if ( argc != 2 )
//    {
//        cout << "Required argument as STL file path to load" << endl;
//        return -1;
//    }
//    std::string inputFilename = argv[1];

    QApplication app(argc, argv);

//    // create widget
//    QVTKOpenGLWidget widget;
//    widget.resize(256,256);

//    // create window for rendering
//    vtkNew<vtkGenericOpenGLRenderWindow> renderWindow;

//    // set rendering window to widget.
//    widget.SetRenderWindow(renderWindow);

//    // create STL Reader and set STL file.
//    vtkSmartPointer<vtkSTLReader> reader =
//      vtkSmartPointer<vtkSTLReader>::New();
//    reader->SetFileName(inputFilename.c_str());
//    reader->Update();

//    // map STL data to poly data mapper.
//    vtkSmartPointer<vtkPolyDataMapper> mapper =
//      vtkSmartPointer<vtkPolyDataMapper>::New();
//    mapper->SetInputConnection(reader->GetOutputPort());

//    // set mapper to actor.
//    vtkSmartPointer<vtkActor> actor =
//      vtkSmartPointer<vtkActor>::New();
//    actor->SetMapper(mapper);

//    // create renderer and set actor to renderer
//    vtkSmartPointer<vtkRenderer> renderer =
//      vtkSmartPointer<vtkRenderer>::New();
//    renderer->AddActor(actor);

//    // render window
//    renderWindow->AddRenderer(renderer);
//    renderWindow->Render();

//    // show widget
//    widget.show();

    MainWindow mainWindow;
    mainWindow.show();

    app.exec();

    return 0;
}
