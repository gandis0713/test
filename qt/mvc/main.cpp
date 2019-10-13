#include "cmainwindowcon.h"
#include "mainwindow.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow mainWindow;
    CMainWindowCon mainController(&mainWindow);
    mainWindow.setMainControllerObs(&mainController);
    mainController.show();

    return a.exec();
}
