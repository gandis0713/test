// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int shared_2_static_num;

int get_shared_2_static_num();

int& get_shared_2_static_num_reference();

void print_shared_2_static_num();

class shared_2_header_class
{
public:
    shared_2_header_class();
    static shared_2_header_class& get_instance();
    static int id;
};

// #endif