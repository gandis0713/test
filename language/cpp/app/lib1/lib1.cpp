#include "../inc/lib1.h"
// #include "../inc/lib2.h"

#include <iostream>

using namespace std;

static int nlib1 = 0;

int getlib1()
{
    return nlib1;
}

void setlib1(int n)
{
    nlib1 = n;
}

// void printlib2()
// {
//     cout << "lib2 : " << getlib2() << endl;
// }