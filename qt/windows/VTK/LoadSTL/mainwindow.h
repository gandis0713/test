#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

#include <vtkRenderer.h>
#include <vtkSmartPointer.h>
#include <vtkGenericOpenGLRenderWindow.h>
#include <vtkDistanceToCamera.h>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    Ui::MainWindow *ui;

    vtkSmartPointer<vtkRenderer> m_Renderer;
    vtkNew<vtkGenericOpenGLRenderWindow> m_RenderWindow;
    vtkSmartPointer<vtkDistanceToCamera> m_DistanceToCamera;

private slots:
    void SlotOpenSTL();
    void SlotSaveSTL();
};

#endif // MAINWINDOW_H
