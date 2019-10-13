#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "clistmodel.h"

namespace Ui {
class MainWindow;
}

class MainController : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainController(QWidget *parent = 0);
    ~MainController();

private:
    Ui::MainWindow *ui;
    CListModel m_lstModel;
};

#endif // MAINWINDOW_H
