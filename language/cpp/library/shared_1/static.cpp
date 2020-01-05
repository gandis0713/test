#include <iostream>
using namespace std;
#include "static.h"

int get_shared_1_static_num()
{
    cout << "get_shared_1_static_num() : " << shared_1_static_num << endl;
    return shared_1_static_num;
}

int& get_shared_1_static_num_reference()
{
    cout << "get_shared_1_static_num_reference() : " << &shared_1_static_num << endl;
    return shared_1_static_num;
}

void print_shared_1_static_num()
{
    cout << "print_shared_1_static_num() : " << shared_1_static_num << endl;
}

class shared_1_cpp_class
{
public:
    shared_1_cpp_class(){}
    static shared_1_cpp_class& get_instance()
    {
        static shared_1_cpp_class instance;
        return instance;
    }
    static int id;
};
int shared_1_cpp_class::id = 0;

int shared_1_header_class::id = 0;
shared_1_header_class::shared_1_header_class()
{
    shared_1_cpp_class::get_instance();
}

shared_1_header_class& shared_1_header_class::get_instance()
{
    static shared_1_header_class instance;
    return instance;
}

