#include "clistmodel.h"

CListModel::CListModel()
{
    // do nothing.
}

CListModel::~CListModel()
{
    // do nothing.
}

void CListModel::Add(const QString &strNew)
{
    QList::append(strNew);
}

void CListModel::Delete(int nIndex)
{
    QList::removeAt(nIndex);
}
