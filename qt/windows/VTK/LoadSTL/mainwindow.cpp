#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QFileDialog>

#include <vtkGenericOpenGLRenderWindow.h>
#include <vtkSTLReader.h>
#include <vtkPolyDataMapper.h>

// added below code to handle the vtkPolyDataMapper error.
#include <vtkAutoInit.h>
VTK_MODULE_INIT(vtkRenderingOpenGL2);
VTK_MODULE_INIT(vtkInteractionStyle);
/* reference :
 * https://stackoverflow.com/questions/18642155/no-override-found-for-vtkpolydatamapper
 */

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    connect(ui->btnOpen, SIGNAL(clicked(bool)), this, SLOT(SlotOpenSTL()));
    connect(ui->btnSave, SIGNAL(clicked(bool)), this, SLOT(SlotSaveSTL()));


    // create renderer and set actor to renderer
    m_Renderer = vtkRenderer::New();

    // set rendering window to widget.
    ui->widget->SetRenderWindow(m_RenderWindow);

    // render window
    m_RenderWindow->AddRenderer(m_Renderer);
    m_RenderWindow->Render();

}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::SlotOpenSTL()
{
    m_Renderer->RemoveAllObservers();

    QString strFileName = QFileDialog::getOpenFileName(this, tr("Open STL"), "", tr("STL Files (*.stl)"));
    if(strFileName.isEmpty())
    {
        return;
    }

    QByteArray ba = strFileName.toLatin1();
    const char *c_str2 = ba.data();

    // create STL Reader and set STL file.
    vtkSmartPointer<vtkSTLReader> reader =
      vtkSmartPointer<vtkSTLReader>::New();

    reader->SetFileName(c_str2);
    reader->Update();

    // map STL data to poly data mapper.
    vtkSmartPointer<vtkPolyDataMapper> mapper =
      vtkSmartPointer<vtkPolyDataMapper>::New();
    mapper->SetInputConnection(reader->GetOutputPort());

    // set mapper to actor.
    vtkSmartPointer<vtkActor> actor =
      vtkSmartPointer<vtkActor>::New();
    actor->SetMapper(mapper);

    m_Renderer->AddActor(actor);

}
void MainWindow::SlotSaveSTL()
{

}
