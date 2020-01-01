#include <iostream>
using namespace std;
#include "static.h"

int get_shared_1_static_num()
{
    cout << "get_shared_1_static_num() : " << shared_1_static_num << endl;
    return shared_1_static_num;
}

int& get_shared_1_static_num_reference()
{
    cout << "get_shared_1_static_num_reference() : " << &shared_1_static_num << endl;
    return shared_1_static_num;
}

void print_shared_1_static_num()
{
    cout << "print_shared_1_static_num() : " << shared_1_static_num << endl;
}