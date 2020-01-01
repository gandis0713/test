#include <iostream>
using namespace std;
#include "static.h"

static_2_with_static_1_class::static_2_with_static_1_class()
    :_s_1_class(static_1_class::get_instance())
{
    cout << "static_2_with_static_1_class, static_1_class::get_instance : " << &static_1_class::get_instance() << endl;
    cout << "static_2_with_static_1_class,                   _s_1_class : " << &_s_1_class << endl;
}

static_1_class& static_2_with_static_1_class::get_static_1_class_instance()
{
    cout << "static_2_with_static_1_class::get_static_1_class_instance, _s_1_class : " << &_s_1_class << endl;
    return _s_1_class;
}