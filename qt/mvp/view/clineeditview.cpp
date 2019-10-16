#include "clineeditview.h"

CLineEditView::CLineEditView(QWidget *parent)
    : QLineEdit(parent)
{
    // do nothing.
}

CLineEditView::~CLineEditView()
{
    // do nothing.
}

QString CLineEditView::GetText()
{
    return text();
}

void CLineEditView::ClearText()
{
    clear();
}
