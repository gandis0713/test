// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int static_1_static_num;

int get_static_1_static_num();

int& get_static_1_static_num_reference();

void print_static_1_static_num();

class static_1_cpp_class;
class static_1_header_class
{
public:
    static_1_header_class();
    static static_1_header_class& get_instance();
    static int id;
private:
    static_1_cpp_class &_st_1_c_class;
};

// #endif