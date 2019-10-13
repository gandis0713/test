#ifndef ILISTLISTENER_H
#define ILISTLISTENER_H

#include <QString>

class IListListner
{
public:
    virtual void OnAdded(const QString &strNew) = 0;
    virtual void OnDeleted(const int &nIndex) = 0;
};

#endif // ILISTLISTENER_H
