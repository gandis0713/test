#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "view/imainwindowview.h"

class CMainWindowPresenter;

namespace Ui {
class CMainWindowView;
}

class CMainWindowView : public QMainWindow, public IMainWindowView
{
    Q_OBJECT

public:
    explicit CMainWindowView(QWidget *parent = 0);
    ~CMainWindowView();

private slots:
    void SlotClieckAdded(bool bState);
    void SlotClieckDeleted(bool bState);


private:
    Ui::CMainWindowView *ui;
    CMainWindowPresenter *m_pMainWindowPresenter;
};

#endif // MAINWINDOW_H
