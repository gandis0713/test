#include "people.h"

CPeople::CPeople() :
    m_nAge(0)
{

}

CPeople& CPeople::GetInstance()
{
    static CPeople instance;
    return instance;
}

void CPeople::AddAge(int nAge)
{
    m_nAge += nAge;
}

int CPeople::GetAge()
{
    return m_nAge;
}