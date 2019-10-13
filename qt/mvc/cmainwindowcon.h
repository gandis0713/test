#ifndef MAINWINDOWCON_H
#define MAINWINDOWCON_H

#include "mainwindow.h"
#include "cmodel.h"
#include "imaincontrollerobs.h"

#include <QList>

class CMainWindowCon : public IMainControllerObs
{
public:
    explicit CMainWindowCon(MainWindow *pMainWindow = NULL);
    virtual ~CMainWindowCon();

    void OnClickedNew(const QString &strNew);
    void OnClickedDelete(const int &nIndex);

    void show();

private:
    MainWindow *m_pMainWindow;
    CModel      m_lstModel;
};

#endif // MAINWINDOWCON_H
