#include "clistviewpresenter.h"
#include "view/ilistwidgetview.h"

CListViewPresenter::CListViewPresenter(IListWidgetView *pListView)
    : m_pListView(pListView)
{
    // do nothing.
}

CListViewPresenter::~CListViewPresenter()
{
    // do nothing.
}

void CListViewPresenter::Added(const QString &strNew)
{
    m_pListView->Add(strNew);
}

void CListViewPresenter::Deleted(const int &nIndex)
{
    m_pListView->Delete(nIndex);
}
