#include <iostream>
using namespace std;
#include "static.h"

static_1_with_lib_class::static_1_with_lib_class()
    : _st_1_class(static_1_class::get_instance())
    , _sh_1_class(shared_1_class::get_instance())
{
    cout << "static_1_with_lib_class, static_1_class::get_instance : " << &static_1_class::get_instance() << endl;
    cout << "static_1_with_lib_class,                  _st_1_class : " << &_st_1_class << endl;
    cout << "static_1_with_lib_class, shared_1_class::get_instance : " << &shared_1_class::get_instance() << endl;
    cout << "static_1_with_lib_class,                  _sh_1_class : " << &_sh_1_class << endl;
    cout << "static_1_with_lib_class,           static_1_class::id : " << &static_1_class::id << endl;
    cout << "static_1_with_lib_class,           shared_1_class::id : " << &shared_1_class::id << endl;
}

static_1_class& static_1_with_lib_class::get_static_1_class_instance()
{
    cout << "static_1_with_lib_class::get_static_1_class_instance, _st_1_class : " << &_st_1_class << endl;
    return _st_1_class;
}