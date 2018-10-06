#include "RequestSender.h"
#include "RequestSendTask.h"

#include <QThread>
#include <QDebug>

CRequestSender::CRequestSender(QObject *parent) :
    QObject(parent),
    eSenderState(ESenderState::eReady)
{
    qRegisterMetaType<SSendItem>("SSendItem");

    LoadRequestItems();
    LoadRequestSenderConfig();
    CreateSendTask();
}

void CRequestSender::run()
{
    while(true)
    {
        QThread::sleep(1);

        if(eSenderState != ESenderState::eReady)
        {
            continue;
        }

        SRequestItem sRequestItem;
        if(false == GetNextSendRequestItem(sRequestItem))
        {
            continue;
        }

        GenerateSendItem(sRequestItem);

        for(int i = 0; i < m_vecRequestItems.size(); i++)
        {
            qDebug() << " m_vecRequestItems[i].nState : " << QString::number(m_vecRequestItems[i].nState);
        }

        eSenderState = ESenderState::eSending;

        for(int i = 0; i < m_pSendThreadPool->maxThreadCount(); i++)
        {
            if(m_vecSendItems.size() <= i)
            {
                break;
            }
            CRequestSendTask *pSendTask = new CRequestSendTask();
            m_vecSendItems[i].nState = CRequestSendTask::ESendItemState::eSending;
            pSendTask->SetSendItem(m_vecSendItems[i]);
            pSendTask->setAutoDelete(true);

            connect(pSendTask, SIGNAL(SignalFinished(SSendItem)), this, SLOT(SlotFinished(SSendItem)));

            m_pSendThreadPool->start(pSendTask);
        }
    }
}

void CRequestSender::CreateSendTask()
{
    m_pSendThreadPool = new QThreadPool();
    m_pSendThreadPool->setMaxThreadCount(sRequestSenderConfig.sThreadConfig.nNumber);
}

bool CRequestSender::LoadRequestItems()
{
    m_vecRequestItems.clear();

    for(int i = 0; i < 4; i++)
    {
        SRequestItem sRequestItem;
        sRequestItem.nID = i;
        sRequestItem.nState = ERequestItemState::eReady;
        for(int j = 0; j < 5; j++)
        {
            SSendItem sSendItem;
            sSendItem.nState = CRequestSendTask::ESendItemState::eReady;
            sSendItem.nID = j;
            sRequestItem.vecSendItems.push_back(sSendItem);
        }

        m_vecRequestItems.push_back(sRequestItem);
    }

    return true;
}

bool CRequestSender::LoadRequestSenderConfig()
{
    sRequestSenderConfig.sThreadConfig.nNumber = 10;

    return true;
}

bool CRequestSender::GetNextSendRequestItem(SRequestItem &sRequestItem)
{
    if(0 >= m_vecRequestItems.size())
    {
           return false;
    }

    for(int i = 0; i < m_vecRequestItems.size(); i++)
    {
        if(m_vecRequestItems[i].nState == ERequestItemState::eSending)
        {
            sRequestItem.nID = m_vecRequestItems[i].nID;
            sRequestItem.nState = m_vecRequestItems[i].nState;
            for(int j = 0; j < m_vecRequestItems[i].vecSendItems.size(); j++)
            {

                qDebug() << "state : " << QString::number(m_vecRequestItems[i].vecSendItems[j].nState);
                sRequestItem.vecSendItems.push_back(m_vecRequestItems[i].vecSendItems[j]);
            }
            return true;
        }

        if(m_vecRequestItems[i].nState == ERequestItemState::eReady)
        {
            sRequestItem.nID = m_vecRequestItems[i].nID;
            sRequestItem.nState = m_vecRequestItems[i].nState;
            for(int j = 0; j < m_vecRequestItems[i].vecSendItems.size(); j++)
            {
                qDebug() << "state : " << QString::number(m_vecRequestItems[i].vecSendItems[j].nState);
                sRequestItem.vecSendItems.push_back(m_vecRequestItems[i].vecSendItems[j]);
            }

            m_vecRequestItems[i].nState = ERequestItemState::eSending;
            return true;
        }
    }



    return true;
}


bool CRequestSender::GenerateSendItem(const SRequestItem &sRequestItem)
{
    m_vecSendItems.clear();

    for(int i = 0; i < sRequestItem.vecSendItems.size(); i++)
    {
        m_vecSendItems.push_back(sRequestItem.vecSendItems[i]);
    }

    return true;
}


void CRequestSender::SlotFinished(SSendItem sSendItem)
{

    for(int i = 0; i < m_vecSendItems.size(); i++)
    {
        if(m_vecSendItems[i].nID == sSendItem.nID)
        {
            if(sSendItem.nState == CRequestSendTask::ESendItemState::eComplete)
            {
                m_vecSendItems.removeAt(i);
            }
            else
            {
                m_vecSendItems[i].nState = CRequestSendTask::ESendItemState::eFail;
            }
        }
    }

    for(int i = 0; i < m_vecSendItems.size(); i++)
    {
        if(m_vecSendItems[i].nState == CRequestSendTask::ESendItemState::eReady)
        {
            CRequestSendTask *pSendTask = new CRequestSendTask();
            m_vecSendItems[i].nState = CRequestSendTask::ESendItemState::eSending;
            pSendTask->SetSendItem(m_vecSendItems[i]);
            pSendTask->setAutoDelete(true);

            connect(pSendTask, SIGNAL(SignalFinished(SSendItem)), this, SLOT(SlotFinished(SSendItem)));

            m_pSendThreadPool->start(pSendTask);

            return;
        }
    }

    for(int i = 0; i < m_vecSendItems.size(); i++)
    {
        if(m_vecSendItems[i].nState == CRequestSendTask::ESendItemState::eSending)
        {
            return;
        }
    }


    qDebug() << "m_vecSendItems.size() : " << QString::number(m_vecSendItems.size());

    if(0 >= m_vecSendItems.size())
    {
        for(int i = 0; i < m_vecRequestItems.size(); i++)
        {
            if(m_vecRequestItems[i].nState == ERequestItemState::eSending)
            {
                m_vecRequestItems.removeAt(i);
            }
        }
    }
    else
    {
        for(int i = 0; i < m_vecRequestItems.size(); i++)
        {
            if(m_vecRequestItems[i].nState == ERequestItemState::eSending)
            {
                m_vecRequestItems[i].nState = ERequestItemState::eFail;
            }
        }
    }


    eSenderState = ESenderState::eReady;
}
