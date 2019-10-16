#include "clistwidgetview.h"

CListWidgetView::CListWidgetView(QWidget *parent)
    : QListWidget(parent)
{
    // do nothing.
}

CListWidgetView::~CListWidgetView()
{
    // do nothing.
}

void CListWidgetView::Add(const QString &strNew)
{
    addItem(strNew);
}

void CListWidgetView::Delete(const int &nIndex)
{
    model()->removeRow(nIndex);
}

int CListWidgetView::GetSelectedIndex()
{
    return currentIndex().row();
}
