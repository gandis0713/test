#include <QString>
#include <QFile>
#include <QtTest>
#include "JsonParser.h"

class CJsonParser_Test : public QObject
{
    Q_OBJECT

public:
    CJsonParser_Test();

private Q_SLOTS:
    void IsValidRequestData_Test();
    void IsValidPeerInfo_Test();
};

CJsonParser_Test::CJsonParser_Test()
{
}

void CJsonParser_Test::IsValidRequestData_Test()
{
    bool result = true;

    QString strFilePath = "C:/Users/gandis/Desktop/projects/qt/EzMtDicomSender/src/Resource/request.json";
    QFile requestFile(strFilePath);

    if(requestFile.exists() == false || requestFile.open(QIODevice::ReadOnly) == false)
    {
        result = false;
    }
    QCOMPARE(true, result);

    QByteArray readData = requestFile.readAll();
    result = CJsonParser::IsValidRequestData(readData);

    QCOMPARE(true, result);
}

void CJsonParser_Test::IsValidPeerInfo_Test()
{
    bool result = true;

    QString strJsonFormat =  QString("{   "
                                     "   \"Peer\": \"127.0.0.1\""
                                     "}");

    QByteArray byteJsonFormat = strJsonFormat.toUtf8();

    QJsonDocument jsonDocument = QJsonDocument::fromJson(byteJsonFormat);
    QJsonObject jsonObject = jsonDocument.object();

    result = CJsonParser::IsValidPeerInfo(jsonObject);
    QCOMPARE(true, result);
    result = CJsonParser::IsValidPeerInfo(jsonObject);
    QCOMPARE(true, result);
}

QTEST_APPLESS_MAIN(CJsonParser_Test)

#include "CJsonParser_Test.moc"
