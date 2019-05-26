#include "pathmanager.h"

CPathManager::CPathManager()
{

}

CPathManager& CPathManager::GetInstance()
{
    static CPathManager instance;
    return instance;
}

QString CPathManager::GetGLSLPath()
{
    QString strGLSLPath = qApp->applicationDirPath() + "/.." + "/glsl";

    return strGLSLPath;
}
