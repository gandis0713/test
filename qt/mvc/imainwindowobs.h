#ifndef IMAINWINDOWOBS_H
#define IMAINWINDOWOBS_H

#include <QString>

class IMainWindowObs
{
public:
    virtual void OnAdded(const QString &strNew) = 0;
    virtual void OnDeleted(const int &nIndex) = 0;
};

#endif // IMAINWINDOWOBS_H
