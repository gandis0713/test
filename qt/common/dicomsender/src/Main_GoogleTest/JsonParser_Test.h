#ifndef CJSONPARSER_TEST_H
#define CJSONPARSER_TEST_H

#include "JsonParser.h"

class CJsonParser_Test : public CJsonParser
{
public:

    MOCK_METHOD3(LoadRequestData, bool(const QByteArray &data, SRequestInfo &sRequestInfo, bool isCheckValid));
    MOCK_METHOD3(IsValidFileInfo, bool(const QByteArray &data, SResultInfo &sResultInfo, bool isCheckValid));

    MOCK_METHOD1(IsValidRequestData, bool(const QByteArray &data));
    MOCK_METHOD1(IsValidResultData, bool(const QByteArray &data));
    MOCK_METHOD1(IsValidPeerInfo, bool(const QByteArray &data));
    MOCK_METHOD1(IsValidPortInfo, bool(const QByteArray &data));
    MOCK_METHOD1(IsValidFileInfo, bool(const QByteArray &data));


}
#endif // CJSONPARSER_TEST_H
