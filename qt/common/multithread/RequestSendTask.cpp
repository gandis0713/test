#include "RequestSendTask.h"

CRequestSendTask::CRequestSendTask(QObject *parent) :
    QObject(parent)
{

}

void CRequestSendTask::run()
{
    m_sSendItem.nState = ESendItemState::eComplete;
    emit SignalFinished(m_sSendItem);

}

void CRequestSendTask::SetSendItem(const SSendItem &sSendItem)
{
    m_sSendItem.nID = sSendItem.nID;
    m_sSendItem.nState = sSendItem.nState;
}
