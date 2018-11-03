#include <QtCore>
#include <QFile>
#include <QString>
#include <QDateTime>
#include <QDir>

QString strNum = QString();
QString strFilePath1 = QString();
QString strFilePath2 = QString();
QString strDirPath = QString();
int count = 0;
QMutex mutex;

class Writer : public QThread
{
public:
public:
    void run() override
    {
        while(true)
        {
            mutex.lock();

            QDateTime t = QDateTime::currentDateTime ();
            QString s = t.toString("dd:ss:zzz");

            QFile file2(strFilePath2);
            if(!file2.open(QIODevice::Text | QIODevice::Append))
            {
                qDebug() << "failed to open file 2";
                continue;
            }
            bool bResult = false;
            while(bResult)
            {
                qDebug() << "testestts";
                file2.startTransaction();
                bResult = !file2.isTransactionStarted();
            }

            file2.commitTransaction();
            continue;

            QFile file(strFilePath1);
            if(!file.open(QIODevice::Text | QIODevice::Append))
            {
                qDebug() << "failed to open file 1";
                continue;
            }
            file.startTransaction();

            QTextStream stream(&file);
            QTextStream stream2(&file2);
            stream2<<"[CARACTER Before "<<count <<" ]" <<strNum<<"["<<s<<"]"<<endl;
            stream<<"[CARACTER " << count << " ]" <<strNum<<"["<<s<<"]"<<endl;
            file.commitTransaction();
            stream2<<"[CARACTER After "<<count <<" ]" <<strNum<<"["<<s<<"]"<<endl;
            file2.commitTransaction();
            count++;

            //file.close();
            //file2.close();

            mutex.unlock();
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);
    if(argc < 2)
    {
        strNum = QString("test_sub");
    }
    else
    {
        strNum = argv[1];
    }

    strDirPath = QCoreApplication::applicationDirPath() + "/write";
    strFilePath1 = strDirPath + "/" + "test.txt";
    strFilePath2 = strDirPath + "/" + strNum + ".txt";
    QDir dir(strDirPath);
    if(!dir.exists())
    {
        dir.mkdir(strDirPath);
    }
    Writer writer;

//    QFile file(strFilePath1);
//    QFile file2(strFilePath2);

//    if (file.open(QIODevice::Text | QIODevice::Append) )
//    {
//        writer.file = &file;
//    }
//    else
//    {
//        qDebug() << " failed to open file 1 : " << strFilePath1;
//        return 0;
//    }
//    if (file2.open(QIODevice::Text | QIODevice::Append) )
//    {
//        writer.file2 = &file2;
//    }
//    else
//    {
//        qDebug() << " failed to open file 2 : " << strFilePath2;
//        return 0;
//    }

    writer.start();
    writer.wait();

    return 0;
}
