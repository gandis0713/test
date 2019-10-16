#ifndef CEDITTEXT_H
#define CEDITTEXT_H

#include <QLineEdit>

#include "ilineeditview.h"

class CLineEditView : public QLineEdit, public ILineEditView
{
public:
    explicit CLineEditView(QWidget *parent = nullptr);
    virtual ~CLineEditView();

    QString GetText() override;
    void ClearText() override;
};

#endif // CEDITTEXT_H
