#include <iostream>

#include "../../../engine/inc/engine1.h"

using namespace std;

void printInt(int number);

int main()
{
    int a = 10;
    int b = 100;
    Plus(b);
    Plus(a);
    printInt(GetResult()); 
    printInt(GetResult()); 
    return 0;
}


void printInt(int number)
{
    cout << number << endl;
}