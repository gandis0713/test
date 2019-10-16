#include "cmainwindowpresenter.h"

#include "view/imainwindowview.h"
#include "view/ilistwidgetview.h"
#include "view/ilineeditview.h"

CMainWindowPresenter::CMainWindowPresenter(IMainWindowView *pMainWindow,
                                           IListWidgetView *pListView,
                                           ILineEditView *pLineEditView)
    : m_pMainWindow(pMainWindow)
    , m_pListView(pListView)
    , m_pLineEditView(pLineEditView)
{
    // do nothing.
}

CMainWindowPresenter::~CMainWindowPresenter()
{
    // do nothing.
}

void CMainWindowPresenter::Add()
{
    QString strNew = m_pLineEditView->GetText();

    if(strNew.isEmpty())
        return;

    m_listModel.Add(strNew);
    m_pListView->Add(strNew);
    m_pLineEditView->ClearText();
}
void CMainWindowPresenter::Delete()
{
    int nIndex = m_pListView->GetSelectedIndex();
    if(nIndex < 0)
        return;

    m_listModel.Delete(nIndex);
    m_pListView->Delete(nIndex);
}
