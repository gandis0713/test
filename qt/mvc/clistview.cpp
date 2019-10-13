#include "clistview.h"

CListView::CListView(QWidget *parent)
    : QListWidget(parent)
{
    // do nothing.
}

CListView::~CListView()
{
    // do nothing.
}

void CListView::OnAdded(const QString &strNew)
{
    addItem(strNew);
}

void CListView::OnDeleted(const int &nIndex)
{
    model()->removeRow(nIndex);
}

