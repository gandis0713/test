#include <iostream>
using namespace std;
#include "static.h"

int get_static_1_static_num()
{
    cout << "get_static_1_static_num() : " << static_1_static_num << endl;
    return static_1_static_num;
}

int& get_static_1_static_num_reference()
{
    cout << "get_static_1_static_num_reference() : " << &static_1_static_num << endl;
    return static_1_static_num;
}

void print_static_1_static_num()
{
    cout << "print_static_1_static_num() : " << static_1_static_num << endl;
}