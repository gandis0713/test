#include <QtCore>

#include <QFile>
#include <QString>
#include <QDateTime>
#include <QDir>

char *cNum;

class Writer : public QThread
{
public:
    QFile *file;
    QFile *file2;
public:
    void run() override
    {
        while(true)
        {
            QDateTime t = QDateTime::currentDateTime ();
            QString s = t.toString("dd:ss:zzz");
            QTextStream stream( file );
            QTextStream stream2( file2 );
//            stream << "[CARACTER]"<<cNum<<cNum<<cNum<<cNum<<cNum<<endl;
            stream2<<"[CARACTER Before]"<<cNum<<"["<<s<<"]"<<endl;
            stream<<"[CARACTER]"<<cNum<<"["<<s<<"]"<<endl;
            stream2<<"[CARACTER After]"<<cNum<<"["<<s<<"]"<<endl;
        }
    }
};

class Writer2 : public QThread
{
public:
    QFile *file;
public:
    void run() override
    {
        while(true)
        {
            QDateTime t = QDateTime::currentDateTime ();
            QString s = t.toString("dd:ss:zzz");
            QTextStream stream( file );
            stream<<"[CARACTER2]"<<cNum<<"["<<s<<"]"<<endl;
        }
    }
};


int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);
    QString strDirPath = QCoreApplication::applicationDirPath() + "/write";
    QDir dir(strDirPath);
    if(!dir.exists())
    {
        dir.mkdir(strDirPath);
    }

    qDebug() << " arg size : " <<argc;
    qDebug() << " argv[0] : " <<argv[0];
    qDebug() << " argv[1] : " <<argv[1];
    cNum = argv[1];
    QString strFilePath1 = strDirPath + "/" + "test.txt";
    QFile file(strFilePath1);
    QString strFilePath2 = strDirPath + "/" + cNum + ".txt";
    QFile file2(strFilePath2);
    Writer writer;
    Writer2 writer2;
    if (file.open(QIODevice::Text | QIODevice::Append) )
    {
        writer.file = &file;
    }
    else
    {
        qDebug() << " failed to open file 1 : " << strFilePath1;
        return 0;
    }
    if (file2.open(QIODevice::Text | QIODevice::Append) )
    {
        writer.file2 = &file2;
    }
    else
    {
        qDebug() << " failed to open file 2 : " << strFilePath2;
        return 0;
    }

    writer.start();
//    writer2.start();
    writer.wait();
//    writer2.wait();
    return 0;
}
