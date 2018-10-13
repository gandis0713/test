#include "mainwindow.h"
#include <QApplication>



int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    MainWindow mainWindows;
    mainWindows.show();

    return a.exec();
}
