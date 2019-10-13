#include "cmainwindowcon.h"

CMainWindowCon::CMainWindowCon(MainWindow *pMainWindow)
    : m_pMainWindow(pMainWindow)
{
    m_lstModel.setMainWindowObs(m_pMainWindow);
}

CMainWindowCon::~CMainWindowCon()
{
    // do nothing.
}

void CMainWindowCon::show()
{
    if(m_pMainWindow != NULL)
        m_pMainWindow->show();
}

void CMainWindowCon::OnClickedNew(const QString &strNew)
{
    m_lstModel.append(strNew);
}

void CMainWindowCon::OnClickedDelete(const int &nIndex)
{
    m_lstModel.removeAt(nIndex);
}
