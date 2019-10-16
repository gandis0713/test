#ifndef IEDITTEXTVIEW_H
#define IEDITTEXTVIEW_H

#include <QString>

class ILineEditView
{
public:
    virtual QString GetText() = 0;
    virtual void ClearText() = 0;
};

#endif // IEDITTEXTVIEW_H
