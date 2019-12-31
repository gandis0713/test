#include <iostream>
using namespace std;
#include "global.h"
#include "../static/global.h"

int sgnum2 = 0;

int getsgnum2()
{
    cout << "shared getgnum() : " << &gnum << endl;
    gnum++;
    return gnum;
}

void printsgnum2()
{
    cout << "getsgnum : " << gnum << endl;
}
