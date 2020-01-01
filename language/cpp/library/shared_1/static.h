// #ifndef STATIC_H
// #define STATIC_H
#pragma once

static int shared_1_static_num;

int get_shared_1_static_num();

int& get_shared_1_static_num_reference();

void print_shared_1_static_num();

class shared_1_class
{
public:
    shared_1_class();
    static shared_1_class& get_instance();
};

// #endif