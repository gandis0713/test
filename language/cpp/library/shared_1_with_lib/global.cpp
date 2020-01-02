#include <iostream>
using namespace std;
#include "global.h"
#include "../static_1/global.h"
#include "../static_1/static.h"

int get_shared_1_with_lib_global_function_with_static_1_global_num()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_global_num() : " << static_1_global_num << endl;
    return static_1_global_num;
}

int& get_shared_1_with_lib_global_function_with_static_1_global_num_reference()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_global_num_reference() : " << &static_1_global_num << endl;
    return static_1_global_num;
}

int& get_shared_1_with_lib_global_function_with_static_1_global_num_reference_by_function()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_global_num_reference_by_function() : " << &get_static_1_global_num_reference() << endl;
    return get_static_1_global_num_reference();
}

int get_shared_1_with_lib_global_function_with_static_1_static_num()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_static_num() : " << static_1_static_num << endl;
    return static_1_static_num;
}

int& get_shared_1_with_lib_global_function_with_static_1_static_num_reference()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_static_num_reference() : " << &static_1_static_num << endl;
    return static_1_static_num;
}

int& get_shared_1_with_lib_global_function_with_static_1_static_num_reference_by_reference()
{
    cout << "get_shared_1_with_lib_global_function_with_static_1_static_num_reference_by_reference() : " << &get_static_1_static_num_reference() << endl;
    return get_static_1_static_num_reference();
}