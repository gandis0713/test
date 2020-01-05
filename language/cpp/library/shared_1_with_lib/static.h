// #ifndef STATIC_H
// #define STATIC_H
#pragma once

class static_1_header_class;
class shared_1_header_class;

class shared_1_with_lib_class
{
public:
    shared_1_with_lib_class();
    static_1_header_class& get_static_1_header_class_instance();
    shared_1_header_class& get_shared_1_header_class_instance();
private:
    static_1_header_class& _st_1_class;
    shared_1_header_class& _sh_1_class;
};
// #endif