#include <iostream>
// #include "../shared_1/global.h"
// #include "../shared_2/global.h"
// #include "../static_1/global.h"
// #include "../static_2/global.h"

// #include "../shared_1/static.h"
// #include "../shared_2/static.h"
// #include "../static_1/static.h"
// #include "../static_2/static.h"

#include "../shared_1_with_lib/global.h"
#include "../shared_2_with_lib/global.h"
#include "../shared_1_with_lib/static.h"
#include "../shared_2_with_lib/static.h"

// #include "../static_1_with_lib/global.h"
// #include "../static_2_with_lib/global.h"
// #include "../static_1_with_lib/static.h"
// #include "../static_2_with_lib/static.h"
using namespace std;


int main()
{
    // // cout << get_shared_1_global_num() << endl;    
    // cout << &get_shared_1_global_num_reference() << endl;
    // // cout << get_shared_2_global_num() << endl;    
    // cout << &get_shared_2_global_num_reference() << endl;
    // // cout << get_shared_1_static_num() << endl;    
    // cout << &get_shared_1_static_num_reference() << endl;
    // // cout << get_shared_2_static_num() << endl;    
    // cout << &get_shared_2_static_num_reference() << endl;

    // // cout << get_static_1_global_num() << endl;    
    // cout << &get_static_1_global_num_reference() << endl;
    // // cout << get_static_2_global_num() << endl;    
    // cout << &get_static_2_global_num_reference() << endl;
    // // cout << get_static_1_static_num() << endl;    
    // cout << &get_static_1_static_num_reference() << endl;
    // // cout << get_static_2_static_num() << endl;    
    // cout << &get_static_2_static_num_reference() << endl;

    // cout << get_shared_1_with_lib_global_function_with_static_1_global_num() << endl;
    cout << "get_shared_1_with_lib_global_function_with_static_1_global_num_reference : " << &get_shared_1_with_lib_global_function_with_static_1_global_num_reference() << endl;
    // cout << get_shared_1_with_lib_global_function_with_static_1_static_num() << endl;
    cout << "get_shared_1_with_lib_global_function_with_static_1_static_num_reference : " << &get_shared_1_with_lib_global_function_with_static_1_static_num_reference() << endl;
    // cout << get_shared_2_with_lib_global_function_with_static_1_global_num() << endl;
    cout << "get_shared_2_with_lib_global_function_with_static_1_global_num_reference : " << &get_shared_2_with_lib_global_function_with_static_1_global_num_reference() << endl;
    // cout << get_shared_2_with_lib_global_function_with_static_1_static_num() << endl;
    cout << "get_shared_2_with_lib_global_function_with_static_1_static_num_reference : " << &get_shared_2_with_lib_global_function_with_static_1_static_num_reference() << endl;

    // // cout << get_static_1_with_lib_global_function_with_static_1_global_num() << endl;
    // cout << &get_static_1_with_lib_global_function_with_static_1_global_num_reference() << endl;
    // // cout << get_static_1_with_lib_global_function_with_static_1_static_num() << endl;
    // cout << &get_static_1_with_lib_global_function_with_static_1_static_num_reference() << endl;
    // // cout << get_static_2_with_lib_global_function_with_static_1_global_num() << endl;
    // cout << &get_static_2_with_lib_global_function_with_static_1_global_num_reference() << endl;
    // // cout << get_static_2_with_lib_global_function_with_static_1_static_num() << endl;
    // cout << &get_static_2_with_lib_global_function_with_static_1_static_num_reference() << endl;

    // cout << &static_1_header_class::get_instance() << endl;
    // cout << &shared_1_header_class::get_instance() << endl;
    
    // static_1_with_lib_class st_1_w_lib_class;
    // static_2_with_lib_class st_2_w_lib_class;
    shared_1_with_lib_class sh_1_w_lib_class;
    shared_2_with_lib_class sh_2_w_lib_class;

    // cout << &static_1_header_class::id << endl;
    // cout << &shared_1_header_class::id << endl;
    
    return 0;
}