// #include <iostream>
// using namespace std;
#include "static.h"

int get_static_1_static_num()
{
    // cout << "get_static_1_static_num() : " << static_1_static_num << endl;
    return static_1_static_num;
}

int& get_static_1_static_num_reference()
{
    // cout << "get_static_1_static_num_reference() : " << &static_1_static_num << endl;
    return static_1_static_num;
}

void print_static_1_static_num()
{
    // cout << "print_static_1_static_num() : " << static_1_static_num << endl;
}

class static_1_cpp_class
{
public:
    static_1_cpp_class(){}
    static static_1_cpp_class& get_instance()
    {
        static static_1_cpp_class instance;
        return instance;
    }
    static int id;
};
int static_1_cpp_class::id = 0;

int static_1_header_class::id = 0;
static_1_header_class::static_1_header_class()
    : _st_1_c_class(static_1_cpp_class::get_instance())
{

}

static_1_header_class& static_1_header_class::get_instance()
{
    static static_1_header_class instance;
    return instance;
}

