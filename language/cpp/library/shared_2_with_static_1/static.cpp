#include <iostream>
using namespace std;
#include "static.h"

shared_2_with_static_1_class::shared_2_with_static_1_class()
    : _s_1_class(static_1_class::get_instance())
{
    cout << "shared_2_with_static_1_class, static_1_class::get_instance : " << &static_1_class::get_instance() << endl;
    cout << "shared_2_with_static_1_class,                   _s_1_class : " << &_s_1_class << endl;
}

static_1_class& shared_2_with_static_1_class::get_static_1_class_instance()
{
    cout << "shared_2_with_static_1_class::get_static_1_class_instance, _s_1_class : " << &_s_1_class << endl;
    return _s_1_class;
}