#include "RequestHandler.h"

#include <QFile>
#include <QDebug>
#include <QJsonDocument>

CRequestHandler::CRequestHandler()
{
    // Do nothing.
}

CRequestHandler::~CRequestHandler()
{
    // Do nothing.
}

bool CRequestHandler::RegisterWorkItem(const QString &strRequestFile, const QString& strResultFile, SRequestItem &sWorkItem)
{
    sWorkItem.sResultInfo.strResultFilePath = strResultFile;

    if(IsValidRequestFile(strRequestFile) == false)
    {
        QString strDescription = "The request file is invalid.";
        qDebug() << strDescription;
        sWorkItem.sResultInfo.strResult = "2000";
        sWorkItem.sResultInfo.strDescription = strDescription;
        return false;
    }

    if(IsValidResultFile(strResultFile) == false)
    {
        QString strDescription = "The result file is invalid.";
        qDebug() << strDescription;
        sWorkItem.sResultInfo.strResult = "2000";
        sWorkItem.sResultInfo.strDescription = strDescription;
        return false;
    }


    if(false == LoadRequestInfo(strRequestFile, sWorkItem.sRequestInfo, false))
    {
        QString strDescription = "Failed to load request file.";
        qDebug() << strDescription;
        sWorkItem.sResultInfo.strResult = "2000";
        sWorkItem.sResultInfo.strDescription = strDescription;
        return false;
    }

    return true;
}

bool CRequestHandler::CompleteWorkItem(const SResultInfo &sResultInfo)
{
    Q_UNUSED(sResultInfo);
    return false;
}

bool CRequestHandler::IsValidResultFile(const QString &strResultFile)
{
    QFile resultFile(strResultFile);

    if(resultFile.exists() == false || resultFile.open(QIODevice::ReadOnly) == false)
    {
        qDebug() << "failed to open result file.";
        return false;
    }

    QByteArray readData = resultFile.readAll();

    return CJsonParser::IsValidResultData(readData);
}

bool CRequestHandler::IsValidRequestFile(const QString &strRequestFile)
{
    QFile requestFile(strRequestFile);

    if(requestFile.exists() == false || requestFile.open(QIODevice::ReadOnly) == false)
    {
        qDebug() << "failed to open request file.";
        return false;
    }

    QByteArray readData = requestFile.readAll();

    return CJsonParser::IsValidRequestData(readData);
}

bool CRequestHandler::LoadRequestInfo(const QString& strRequestFile, SRequestInfo &sRequestInfo, bool isCheckValid)
{
    QFile requestFile(strRequestFile);

    if(requestFile.exists() == false || requestFile.open(QIODevice::ReadOnly) == false)
    {
        qDebug() << "failed to open request file.";
        return false;
    }

    QByteArray readData = requestFile.readAll();

    return CJsonParser::LoadRequestData(readData, sRequestInfo, isCheckValid);
}

