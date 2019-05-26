#ifndef PATHMANAGER_H
#define PATHMANAGER_H

#include "qtheader.h"

class CPathManager
{
public:
    CPathManager();
    static CPathManager& GetInstance();

    QString GetGLSLPath();
};

#endif // PATHMANAGER_H
