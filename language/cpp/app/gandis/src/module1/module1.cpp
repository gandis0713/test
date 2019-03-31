#include "../inc/module1.h"
#include "../../../engine/inc/engine1.h"
#include "../common/people.h"

#include <iostream>

using namespace std;

int AddPeople(int a)
{
    return Plus(a);
}

int MinusPeople(int a)
{
    return Substract(a);
}

void AddAge(int nAge)
{
    CPeople::GetInstance().AddAge(nAge);
}

int GetAge()
{
    return CPeople::GetInstance().GetAge();
}

