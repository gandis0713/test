#include "JsonParser.h"

#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QFile>

bool CJsonParser::IsValidRequestData(const QByteArray &data)
{
    QJsonDocument jsonDocument = QJsonDocument::fromJson(data);
    QJsonObject jsonObject = jsonDocument.object();

    if(false == IsValidPeerInfo(jsonObject))
    {
        qDebug() << "The peer is invalid information.";
        return false;
    }

    if(false == IsValidPortInfo(jsonObject))
    {
        qDebug() << "The port is invalid information.";
        return false;
    }

    if(false == IsValidFileInfo(jsonObject))
    {
        qDebug() << "The file information is invalid.";
        return false;
    }

    return true;
}

bool CJsonParser::IsValidResultData(const QByteArray &data)
{
    QJsonDocument jsonDocument = QJsonDocument::fromJson(data);
    QJsonObject jsonObject = jsonDocument.object();

    if(false == (jsonObject.contains(RESULT) && jsonObject[RESULT].isString()))
    {
        qDebug() << "The result object format is invalid.";
        return false;
    }

    if(false == (jsonObject.contains(DESCRIPTION) && jsonObject[DESCRIPTION].isString()))
    {
        qDebug() << "The description object format is invalid.";
        return false;
    }

    return true;
}

bool CJsonParser::LoadRequestData(const QByteArray &data, SRequestInfo &sRequestInfo, bool isCheckValid)
{
    QJsonDocument jsonDocument = QJsonDocument::fromJson(data);
    QJsonObject jsonObject = jsonDocument.object();

    if(true == isCheckValid)
    {
        bool isVaild = IsValidRequestData(data);
        if(false == isVaild)
        {
            qDebug() << "The request data is invalid.";
            return false;
        }
    }

    sRequestInfo.strPeer = jsonObject[PEER].toString();
    sRequestInfo.strPort = jsonObject[PORT].toString();
    sRequestInfo.strCount = jsonObject[COUNT].toString();
    sRequestInfo.strFileDir = jsonObject[FILEDIR].toString();

    QJsonArray jsonArray = jsonObject[FILES].toArray();
    for(int nIndex = 0; nIndex < jsonArray.size(); nIndex++)
    {
        QString strFilePath = sRequestInfo.strFileDir + jsonArray[nIndex].toString();
        sRequestInfo.strlFiles << strFilePath;
    }

    return true;
}

bool CJsonParser::LoadResultData(const QByteArray &data, SResultInfo &sResultInfo, bool isCheckValid)
{
    QJsonDocument jsonDocument = QJsonDocument::fromJson(data);
    QJsonObject jsonObject = jsonDocument.object();

    if(true == isCheckValid)
    {
        bool isVaild = IsValidResultData(data);
        if(false == isVaild)
        {
            qDebug() << "The result data is invalid.";
            return false;
        }
    }

    sResultInfo.strResult = jsonObject[RESULT].toString();
    sResultInfo.strDescription = jsonObject[DESCRIPTION].toString();

    return true;
}

bool CJsonParser::IsValidPeerInfo(const QJsonObject &jsonObject)
{

    if(false == (jsonObject.contains(PEER) && jsonObject[PEER].isString()))
    {
        qDebug() << "The peer object format is invalid.";
        return false;
    }

    QString strPeer = jsonObject[PEER].toString();
    QHostAddress address(strPeer);
    if (QAbstractSocket::IPv4Protocol != address.protocol())
    {
        qDebug() << "The peer is not IPv4 protocol format.";
       return false;
    }

    return true;
}

bool CJsonParser::IsValidPortInfo(const QJsonObject &jsonObject)
{
    if(false == (jsonObject.contains(PORT) && jsonObject[PORT].isString()))
    {
        qDebug() << "The port object format is invalid.";
        return false;
    }

    QString strPort = jsonObject[PORT].toString();
    int nPort = strPort.toInt();
    if(nPort < 0 || nPort > 65535)
    {
        qDebug() << "The port number is invalid.";
        return false;
    }

    return true;
}

bool CJsonParser::IsValidFileInfo(const QJsonObject &jsonObject)
{
    if(false == (jsonObject.contains(COUNT) && jsonObject[COUNT].isString()))
    {
        qDebug() << "The count object format is invalid.";
        return false;
    }

    int nCount = jsonObject[COUNT].toString().toInt();

    if(false == (jsonObject.contains(FILEDIR) && jsonObject[FILEDIR].isString()))
    {
        qDebug() << "The file directory object format is invalid.";
        return false;
    }

    QString strFileDir = jsonObject[FILEDIR].toString();

    if(false == (jsonObject.contains(FILES) && jsonObject[FILES].isArray()))
    {
        qDebug() << "The file name array object format is invalid.";
        return false;
    }

    QJsonArray jsonArray = jsonObject[FILES].toArray();
    if(nCount != jsonArray.size())
    {
        qDebug() << "The count and the size of file name array is not same.";
        return false;
    }

    QStringList strlFilesPath = QStringList();
    for(int nIndex = 0; nIndex < nCount; nIndex++)
    {
        QString strFilePath = strFileDir + jsonArray[nIndex].toString();
        strlFilesPath << strFilePath;
    }

    for(int nIndex = 0; nIndex < nCount; nIndex++)
    {
        QFile file(strlFilesPath[nIndex]);
        if(false == file.exists())
        {
            qDebug() << QString("%1 is not exist.").arg(strlFilesPath[nIndex]);
            return false;
        }
    }

    return true;
}
