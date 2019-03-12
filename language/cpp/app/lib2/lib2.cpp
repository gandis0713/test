#include "../inc/lib1.h"
#include "../inc/lib2.h"

#include <iostream>

using namespace std;

static int nlib2 = 0;

int getlib2()
{
    return nlib2;
}

void setlib2(int n)
{
    nlib2 = n;
}

void printlib1()
{
    cout << "lib1 : " << getlib1() << endl;
}