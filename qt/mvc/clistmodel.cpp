#include "clistmodel.h"

CListModel::CListModel()
    : m_pListListener(NULL)
{
    // do nothing.
}

CListModel::~CListModel()
{
    // do nothing.
}

void CListModel::setListListener(IListListner *pListListener)
{
    m_pListListener = pListListener;
}

void CListModel::append(const QString &strNew)
{
    QList::append(strNew);

    if(m_pListListener != NULL)
        m_pListListener->OnAdded(strNew);
}

void CListModel::removeAt(int nIndex)
{
    QList::removeAt(nIndex);

    if(m_pListListener != NULL)
        m_pListListener->OnDeleted(nIndex);
}
