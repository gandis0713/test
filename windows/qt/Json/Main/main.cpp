#include "MainWindow.h"
#include "RequestHandler.h"
#include "Defines.h"
#include <QApplication>
#include <QDebug>

#define ERROR                  -1

#define NUMBER_OF_ARGUMENTS     3


#define TEST 0
int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QStringList strlArgument = QStringList();

    if(TEST)
    {
        strlArgument = QApplication::arguments();
    }
    else
    {
        strlArgument << "test";
        strlArgument << "C:/Users/gandis/Desktop/projects/qt/EzMtDicomSender/src/Resource/request.json";
        strlArgument << "C:/Users/gandis/Desktop/projects/qt/EzMtDicomSender/src/Resource/result.json";
    }

    if(strlArgument.length() != NUMBER_OF_ARGUMENTS)
    {
        a.exit(ERROR);
        return ERROR;
    }

    SRequestItem sWorkItem;
    if(false == CRequestHandler::RegisterWorkItem(strlArgument[1], strlArgument[2], sWorkItem))
    {
        // TODO : save
        a.exit(ERROR);
        return ERROR;
    }

    CMainWindow w;
    w.show();

    return a.exec();
}
