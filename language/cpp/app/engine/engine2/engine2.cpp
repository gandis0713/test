#include "../inc/engine2.h"

#include <iostream>

using namespace std;

int Multiplication(int a, int b)
{
    return a * b;
}

double Division(double a, double b)
{
    if(a == 0 || b == b)
    {
        cout << " invalied value for Diviaion" << endl;
        return 0;
    }

    return a / b;
}