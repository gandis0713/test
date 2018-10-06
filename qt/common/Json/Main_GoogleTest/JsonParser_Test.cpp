#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <gmock/gmock-matchers.h>

#include "JsonParser.h"

#include <QFile>
#include <QJsonDocument>

using namespace testing;

TEST(JsonParser_Test, IsValidRequestData)
{
    bool result = true;

    QString strJsonFormat =  QString("{   "
                                     "   \"Peer\": \"127.0.0.1\","
                                     "   \"Port\": \"2323\","
                                     "   \"Count\": \"2\","
                                     "   \"FileDir\": \"C:/Users/gandis/Desktop/projects/qt/EzMtDicomSender/src/Resource/\","
                                     "   \"Files\": [\"test1.txt\", \"test2.txt\"]"
                                     "}");

    QByteArray byteJsonFormat = strJsonFormat.toUtf8();

    result = CJsonParser::IsValidRequestData(byteJsonFormat);

    EXPECT_TRUE(result);
}
