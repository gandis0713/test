// #include <iostream>
// using namespace std;
#include "static.h"

shared_2_with_lib_class::shared_2_with_lib_class()
    : _st_1_class(static_1_header_class::get_instance())
    , _sh_1_class(shared_1_header_class::get_instance())
{
    // cout << "shared_2_with_lib_class, static_1_header_class::get_instance : " << &static_1_header_class::get_instance() << endl;
    // cout << "shared_2_with_lib_class,                         _st_1_class : " << &_st_1_class << endl;
    // cout << "shared_2_with_lib_class, shared_1_header_class::get_instance : " << &shared_1_header_class::get_instance() << endl;
    // cout << "shared_2_with_lib_class,                         _sh_1_class : " << &_sh_1_class << endl;
    // cout << "shared_2_with_lib_class,           static_1_header_class::id : " << &static_1_header_class::id << endl;
    // cout << "shared_2_with_lib_class,           shared_1_header_class::id : " << &shared_1_header_class::id << endl;
}

static_1_header_class& shared_2_with_lib_class::get_static_1_header_class_instance()
{
    // cout << "shared_2_with_lib_class::get_static_1_header_class_instance, _st_1_class : " << &_st_1_class << endl;
    return _st_1_class;
}

shared_1_header_class& shared_2_with_lib_class::get_shared_1_header_class_instance()
{
    // cout << "shared_2_with_lib_class::get_shared_1_header_class_instance, _sh_1_class : " << &_sh_1_class << endl;
    return _sh_1_class;
}