#ifndef ILISTLISTENER_H
#define ILISTLISTENER_H

#include <QString>

class IListWidgetView
{
public:
    virtual void Add(const QString &strNew) = 0;
    virtual void Delete(const int &nIndex) = 0;

    virtual int GetSelectedIndex() = 0;
};

#endif // ILISTLISTENER_H
