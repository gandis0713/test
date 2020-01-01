#include <iostream>
using namespace std;
#include "static.h"

int get_static_2_static_num()
{
    cout << "get_static_2_static_num() : " << static_2_static_num << endl;
    return static_2_static_num;
}

int& get_static_2_static_num_reference()
{
    cout << "get_static_2_static_num_reference() : " << &static_2_static_num << endl;
    return static_2_static_num;
}

void print_static_2_static_num()
{
    cout << "print_static_2_static_num() : " << static_2_static_num << endl;
}

static_2_class::static_2_class()
{
    // cout << "static_2_class" << endl;
}

static_2_class& static_2_class::get_instance()
{
    // cout << "static_2_class::get_instance" << endl;
    static static_2_class instance;
    return instance;
}