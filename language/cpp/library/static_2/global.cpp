#include <iostream>
using namespace std;
#include "global.h"

int static_2_global_num = 0;

int get_static_2_global_num()
{
    cout << "get_static_2_global_num() : " << static_2_global_num << endl;
    return static_2_global_num;
}

int& get_static_2_global_num_reference()
{
    cout << "get_static_2_global_num_reference() : " << &static_2_global_num << endl;
    return static_2_global_num;
}

void print_static_2_global_num()
{
    cout << "print_static_2_global_num() : " << static_2_global_num << endl;
}