#include "cmainwindowpresenter.h"

#include "view/imainwindowview.h"
#include "view/ilistwidgetview.h"
#include "view/ilineeditview.h"

#include "presenter/clistwidgetviewpresenter.h"
#include "presenter/clineeditviewpresenter.h"

CMainWindowPresenter::CMainWindowPresenter(IMainWindowView *pMainWindow,
                                           IListWidgetView *pListView,
                                           ILineEditView *pLineEditView)
    : m_pMainWindow(pMainWindow)
    , m_pListWidgetViewPresenter(new CListWidgetViewPresenter(pListView))
    , m_pLineEditViewPresenter(new CLineEditViewPresenter(pLineEditView))
{
    // do nothing.
}

CMainWindowPresenter::~CMainWindowPresenter()
{
    delete m_pListWidgetViewPresenter;
    delete m_pLineEditViewPresenter;
}

void CMainWindowPresenter::Add()
{
    QString strNew = m_pLineEditViewPresenter->GetText();

    if(strNew.isEmpty())
        return;

    m_listModel.Add(strNew);
    m_pListWidgetViewPresenter->Add(strNew);
    m_pLineEditViewPresenter->ClearText();
}
void CMainWindowPresenter::Delete()
{
    int nIndex = m_pListWidgetViewPresenter->GetSelectedIndex();
    if(nIndex < 0)
        return;

    m_listModel.Delete(nIndex);
    m_pListWidgetViewPresenter->Delete(nIndex);
}
