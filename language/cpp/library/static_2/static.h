// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int static_2_static_num;

int get_static_2_static_num();

int& get_static_2_static_num_reference();

void print_static_2_static_num();

class static_2_cpp_class;
class static_2_header_class
{
public:
    static_2_header_class();
    static static_2_header_class& get_instance();
    static int id;
private:
    static_2_cpp_class &_st_2_c_class;
};

// #endif