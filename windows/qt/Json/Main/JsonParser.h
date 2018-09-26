#ifndef JSONPARSER_H
#define JSONPARSER_H

#include <QHostInfo>
#include <QByteArray>
#include <QJsonObject>
#include "Defines.h"


class CJsonParser
{
public:
    CJsonParser();
    ~CJsonParser();

    static bool IsValidRequestData(const QByteArray &data);
    static bool IsValidResultData(const QByteArray &data);
    static bool LoadRequestData(const QByteArray &data, SRequestInfo &sRequestInfo, bool isCheckValid = true);
    static bool LoadResultData(const QByteArray &data, SResultInfo &sResultInfo, bool isCheckValid = true);

private:
    static bool IsValidPeerInfo(const QJsonObject &jsonObject);
    static bool IsValidPortInfo(const QJsonObject &jsonObject);
    static bool IsValidFileInfo(const QJsonObject &jsonObject);
};

#endif // JSONPARSER_H
