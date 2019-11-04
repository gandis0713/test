#include "clistwidgetviewpresenter.h"
#include "view/ilistwidgetview.h"

CListWidgetViewPresenter::CListWidgetViewPresenter(IListWidgetView *pListView)
    : m_pListView(pListView)
{
    // do nothing.
}

CListWidgetViewPresenter::~CListWidgetViewPresenter()
{
    // do nothing.
}

void CListWidgetViewPresenter::Add(const QString &strNew)
{
    if(m_pListView != nullptr)
        m_pListView->Add(strNew);
}

void CListWidgetViewPresenter::Delete(const int &nIndex)
{
    if(m_pListView != nullptr)
        m_pListView->Delete(nIndex);
}

int CListWidgetViewPresenter::GetSelectedIndex()
{
    if(m_pListView != nullptr)
        return m_pListView->GetSelectedIndex();

    return -1;
}
