// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int static_2_static_num;

int get_static_2_static_num();

int& get_static_2_static_num_reference();

void print_static_2_static_num();

class static_2_class
{
public:
    static_2_class();
    static static_2_class& get_instance();
};

// #endif