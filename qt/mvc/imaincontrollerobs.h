#ifndef IMAINCONTROLLEROBS_H
#define IMAINCONTROLLEROBS_H

class IMainControllerObs
{
public:
    virtual void OnClickedNew(const QString &strNew) = 0;
    virtual void OnClickedDelete(const int &nIndex) = 0;
};

#endif // IMAINCONTROLLEROBS_H
