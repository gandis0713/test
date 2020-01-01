// #ifndef STATIC_H
// #define STATIC_H
#pragma once
#include "../static_1/static.h"
#include "../shared_1/static.h"

class shared_2_with_lib_class
{
public:
    shared_2_with_lib_class();
    static_1_class& get_static_1_class_instance();
    shared_1_class& get_shared_1_class_instance();
private:
    static_1_class& _st_1_class;
    shared_1_class& _sh_1_class;
};

// #endif