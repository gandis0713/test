#include <iostream>
using namespace std;
#include "global.h"
#include "../static/global.h"

int sgnum = 0;

int getsgnum()
{
    cout << "shared getsgnum() : " << &gnum << endl;
    gnum++;
    return gnum;
}

void printsgnum()
{
    cout << "getsgnum : " << gnum << endl;
}
