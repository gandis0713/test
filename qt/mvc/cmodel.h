#ifndef CMODEL_H
#define CMODEL_H

#include <QList>
#include "imainwindowobs.h"

class CModel : public QList<QString>
{
public:
    explicit CModel();
    virtual ~CModel();

    virtual void append(const QString &strNew);
    virtual void removeAt(int nIndex);

    void setMainWindowObs(IMainWindowObs *pMainWindowObs);

private:
    IMainWindowObs *m_pMainWindowObs;
};

#endif // CMODEL_H
