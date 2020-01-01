#include <iostream>
using namespace std;
#include "static.h"

static_2_with_lib_class::static_2_with_lib_class()
    :_st_1_class(static_1_class::get_instance())
{
    cout << "static_2_with_lib_class, static_1_class::get_instance : " << &static_1_class::get_instance() << endl;
    cout << "static_2_with_lib_class,                   _st_1_class : " << &_st_1_class << endl;
}

static_1_class& static_2_with_lib_class::get_static_1_class_instance()
{
    cout << "static_2_with_lib_class::get_static_1_class_instance, _st_1_class : " << &_st_1_class << endl;
    return _st_1_class;
}