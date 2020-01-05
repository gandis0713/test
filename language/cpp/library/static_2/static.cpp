#include <iostream>
using namespace std;
#include "static.h"

int get_static_2_static_num()
{
    cout << "get_static_2_static_num() : " << static_2_static_num << endl;
    return static_2_static_num;
}

int& get_static_2_static_num_reference()
{
    cout << "get_static_2_static_num_reference() : " << &static_2_static_num << endl;
    return static_2_static_num;
}

void print_static_2_static_num()
{
    cout << "print_static_2_static_num() : " << static_2_static_num << endl;
}

class static_2_cpp_class
{
public:
    static_2_cpp_class(){}
    static static_2_cpp_class& get_instance()
    {
        static static_2_cpp_class instance;
        return instance;
    }
    static int id;
};
int static_2_cpp_class::id = 0;

int static_2_header_class::id = 0;
static_2_header_class::static_2_header_class()
    : _st_2_c_class(static_2_cpp_class::get_instance())
{
    
}

static_2_header_class& static_2_header_class::get_instance()
{
    static static_2_header_class instance;
    return instance;
}

