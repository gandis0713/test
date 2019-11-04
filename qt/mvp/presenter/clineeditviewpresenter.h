#ifndef CLINEEDITVIEWPRESENTER_H
#define CLINEEDITVIEWPRESENTER_H

#include <QString>

class ILineEditView;

class CLineEditViewPresenter
{
public:
    explicit CLineEditViewPresenter(ILineEditView *pLineEditView);
    virtual ~CLineEditViewPresenter();

    QString GetText();
    void ClearText();

private:
    ILineEditView *m_pLineEditView;
};

#endif // CLINEEDITVIEWPRESENTER_H
