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
    return m_pLineEditView->GetText();
}
