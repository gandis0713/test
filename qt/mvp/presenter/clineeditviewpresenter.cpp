#include "clineeditviewpresenter.h"

#include "view/ilineeditview.h"

CLineEditViewPresenter::CLineEditViewPresenter(ILineEditView *pLineEditView)
    : m_pLineEditView(pLineEditView)
{
    // do nothing.
}

CLineEditViewPresenter::~CLineEditViewPresenter()
{
    // do nothing.
}

QString CLineEditViewPresenter::GetText()
{
    if(m_pLineEditView != nullptr)
        return m_pLineEditView->GetText();

    return QString();
}

void CLineEditViewPresenter::ClearText()
{
    if(m_pLineEditView != nullptr)
        m_pLineEditView->ClearText();
}
