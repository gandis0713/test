#ifndef REQUESTHANDLER_H
#define REQUESTHANDLER_H

#include <QString>
#include "Defines.h"
#include "JsonParser.h"

class CRequestHandler
{
public:
    CRequestHandler();
    ~CRequestHandler();

    static bool RegisterWorkItem(const QString& strRequestFile, const QString& strResultFile, SRequestItem &sWorkItem);
    static bool CompleteWorkItem(const SResultInfo &sResultInfo);

private:
    static bool IsValidResultFile(const QString& strResultFile);
    static bool IsValidRequestFile(const QString& strRequestFile);
    static bool LoadRequestInfo(const QString& strRequestFile, SRequestInfo &sRequestInfo, bool isCheckValid = true);
};

#endif // REQUESTHANDLER_H
