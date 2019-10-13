#include "cmodel.h"

CModel::CModel()
    : m_pMainWindowObs(NULL)
{
    // do nothing.
}

CModel::~CModel()
{
    // do nothing.
}

void CModel::setMainWindowObs(IMainWindowObs *pMainWindowObs)
{
    m_pMainWindowObs = pMainWindowObs;
}

void CModel::append(const QString &strNew)
{
    QList::append(strNew);

    if(m_pMainWindowObs != NULL)
        m_pMainWindowObs->OnAdded(strNew);
}

void CModel::removeAt(int nIndex)
{
    QList::removeAt(nIndex);

    if(m_pMainWindowObs != NULL)
        m_pMainWindowObs->OnDeleted(nIndex);
}
