// #include <iostream>
// using namespace std;
#include "global.h"

int static_1_global_num = 0;

int get_static_1_global_num()
{
    // cout << "get_static_1_global_num() : " << static_1_global_num << endl;
    return static_1_global_num;
}

int& get_static_1_global_num_reference()
{
    // cout << "get_static_1_global_num_reference() : " << &static_1_global_num << endl;
    return static_1_global_num;
}

void print_static_1_global_num()
{
    // cout << "print_static_1_global_num() : " << static_1_global_num << endl;
}
