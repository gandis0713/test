// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int static_1_static_num;

int get_static_1_static_num();

int& get_static_1_static_num_reference();

void print_static_1_static_num();

class static_1_class
{
public:
    static_1_class();
    static static_1_class& get_instance();
};

// #endif