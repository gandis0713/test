// #ifndef STATIC_H
// #define STATIC_H
#pragma once

#include "../static_1/static.h"

class static_1_with_lib_class
{
public:
    static_1_with_lib_class();
    static_1_class& get_static_1_class_instance();
private:
    static_1_class& _st_1_class;
};


// #endif