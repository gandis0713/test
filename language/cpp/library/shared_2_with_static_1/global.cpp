#include <iostream>
using namespace std;
#include "global.h"
#include "../static_1/global.h"
#include "../static_1/static.h"

int get_shared_2_global_function_with_static_1_global_num()
{
    cout << "get_shared_2_global_function_with_static_1_global_num() : " << static_1_global_num << endl;
    return static_1_global_num;
}

int& get_shared_2_global_function_with_static_1_global_num_reference()
{
    cout << "get_shared_2_global_function_with_static_1_global_num_reference() : " << &static_1_global_num << endl;
    return static_1_global_num;
}

void print_shared_2_global_function_with_static_1_global_num()
{
    cout << "print_shared_2_global_function_with_static_1_global_num() : " << static_1_global_num << endl;
}

int get_shared_2_global_function_with_static_1_static_num()
{
    cout << "get_shared_2_global_function_with_static_1_static_num() : " << static_1_static_num << endl;
    return static_1_static_num;
}

int& get_shared_2_global_function_with_static_1_static_num_reference()
{
    cout << "get_shared_2_global_function_with_static_1_static_num_reference() : " << &static_1_static_num << endl;
    return static_1_static_num;
}

void print_shared_2_global_function_with_static_1_static_num()
{
    cout << "print_shared_2_global_function_with_static_1_static_num() : " << static_1_static_num << endl;
}
