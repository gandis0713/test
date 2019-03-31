#include <iostream>

#include "../../../engine/inc/engine1.h"
#include "../inc/module1.h"
#include "../inc/module2.h"

using namespace std;

void printInt(int number);

int main()
{
    int a = 10;
    int b = 100;

    printInt(Plus(b)); 
    printInt(Substract(a)); 
    printInt(AddPeople(b)); 
    printInt(AddPeople(a)); 
    printInt(AddDevice(b)); 
    printInt(AddDevice(a)); 
    
    return 0;
}


void printInt(int number)
{
    cout << number << endl;
}