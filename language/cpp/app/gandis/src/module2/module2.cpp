#include "../inc/module2.h"

#include "../../../engine/inc/engine1.h"
#include "../common/people.h"

#include <iostream>

using namespace std;

int AddDevice(int a)
{
    return Plus(a);
}

int MinusDevice(int a)
{
    return Substract(a);
}


void AddNumber(int number)
{
    CPeople::GetInstance().AddAge(number);
}
int GetNumber()
{
    return CPeople::GetInstance().GetAge();
}
