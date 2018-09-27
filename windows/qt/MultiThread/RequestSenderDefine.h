#ifndef REQUESTSENDERDEFINE_H
#define REQUESTSENDERDEFINE_H

#include <QVector>

enum ERequestItemState
{
    eRegistered = 0,
    eReady,
    eSending,
    eComplete,
    eFail
};

struct SSendItem
{
    int nID;
    int nState;
};

struct SRequestItem
{
    int nID;
    int nState;
    QVector<SSendItem> vecSendItems;
};

struct SThreadConfig
{
    int nNumber;
};

struct SRequestSenderConfig
{
    SThreadConfig sThreadConfig;
};

#endif // REQUESTSENDERDEFINE_H
