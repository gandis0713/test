#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "imaincontrollerobs.h"
#include "imainwindowobs.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow, public IMainWindowObs
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

    void OnAdded(const QString &strNew) override;
    void OnDeleted(const int &nIndex) override;

    void setMainControllerObs(IMainControllerObs *pMainControllerObs);

private:
    Ui::MainWindow *ui;
    IMainControllerObs *m_pMainControllerObs;
};

#endif // MAINWINDOW_H
