#include "view/cmainwindowview.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    CMainWindowView mainWindow;
    mainWindow.show();

    return a.exec();
}
