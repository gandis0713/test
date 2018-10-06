#ifndef DEFINES_H
#define DEFINES_H

#include <QString>
#include <QStringList>

#define PEER          "Peer"
#define PORT          "Port"
#define COUNT         "Count"
#define FILEDIR       "FileDir"
#define FILES         "Files"

#define RESULT        "Result"
#define DESCRIPTION   "Description"


typedef struct SRequestInfo
{
    QString strPeer = QString();
    QString strPort = QString();
    QString strCount = QString();
    QString strFileDir = QString();
    QStringList strlFiles = QStringList();
} SRequestInfo;

typedef struct SResultInfo
{
    QString strResultFilePath = QString();
    QString strResult = QString();
    QString strDescription = QString();
} SResultInfo;

typedef struct SRequestItem
{
    SRequestInfo sRequestInfo;
    SResultInfo sResultInfo;
} SRequestItem;

#endif // DEFINES_H
