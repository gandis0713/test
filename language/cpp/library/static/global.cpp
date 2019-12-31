#include <iostream>
using namespace std;
#include "global.h"

int gnum = 0;

int getgnum()
{
    cout << "static getgnum() : " << &gnum << endl;
    return gnum;
}
