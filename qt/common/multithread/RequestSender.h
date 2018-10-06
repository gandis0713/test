#ifndef REQUESTSENDER_H
#define REQUESTSENDER_H

#include "RequestSenderDefine.h"

#include <QRunnable>
#include <QObject>
#include <QVector>
#include <QThreadPool>



class CRequestSender : public QObject, public QRunnable
{
    Q_OBJECT

    enum ESenderState
    {
        eReady = 0,
        eSending
    };


public:
    explicit CRequestSender(QObject *parent = NULL);

protected:
    virtual void run() override;

private:
    void CreateSendTask();
    bool LoadRequestItems();
    bool LoadRequestSenderConfig();
    bool GetNextSendRequestItem(SRequestItem &sRequestItem);
    bool GenerateSendItem(const SRequestItem &sRequestItem);

private:
    QVector<SRequestItem> m_vecRequestItems;
    QVector<SSendItem> m_vecSendItems;

    ESenderState eSenderState;
    SRequestSenderConfig sRequestSenderConfig;

    QThreadPool *m_pSendThreadPool;


public slots:
    void SlotFinished(SSendItem sSendItem);
};

#endif // REQUESTSENDER_H
