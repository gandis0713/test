#ifndef REQUESTSENDTASK_H
#define REQUESTSENDTASK_H

#include "RequestSenderDefine.h"

#include <QRunnable>
#include <QObject>

class CRequestSendTask : public QObject, public QRunnable
{
    Q_OBJECT
public:
    enum ESendItemState
    {
        eReady = 0,
        eSending,
        eComplete,
        eFail
    };

public:
    explicit CRequestSendTask(QObject *parent = nullptr);
    void SetSendItem(const SSendItem &sSendItem);

protected:
    virtual void run() override;

private:
    SSendItem m_sSendItem;

signals:
    void SignalFinished(SSendItem);
};

#endif // REQUESTSENDTASK_H
