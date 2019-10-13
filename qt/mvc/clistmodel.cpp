#include "clistmodel.h"

CListModel::CListModel()
    : m_pMainWindowListener(NULL)
{
    // do nothing.
}

CListModel::~CListModel()
{
    // do nothing.
}

void CListModel::setListListener(IListListner *pMainWindowListener)
{
    m_pMainWindowListener = pMainWindowListener;
}

void CListModel::append(const QString &strNew)
{
    QList::append(strNew);

    if(m_pMainWindowListener != NULL)
        m_pMainWindowListener->OnAdded(strNew);
}

void CListModel::removeAt(int nIndex)
{
    QList::removeAt(nIndex);

    if(m_pMainWindowListener != NULL)
        m_pMainWindowListener->OnDeleted(nIndex);
}
