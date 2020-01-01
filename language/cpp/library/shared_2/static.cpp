#include <iostream>
using namespace std;
#include "static.h"

int get_shared_2_static_num()
{
    cout << "get_shared_2_static_num() : " << shared_2_static_num << endl;
    return shared_2_static_num;
}

int& get_shared_2_static_num_reference()
{
    cout << "get_shared_2_static_num_reference() : " << &shared_2_static_num << endl;
    return shared_2_static_num;
}

void print_shared_2_static_num()
{
    cout << "print_shared_2_static_num() : " << shared_2_static_num << endl;
}

shared_2_class::shared_2_class()
{
    // cout << "shared_2_class" << endl;
}

shared_2_class& shared_2_class::get_instance()
{
    // cout << "shared_2_class::get_instance" << endl;
    static shared_2_class instance;
    return instance;
}