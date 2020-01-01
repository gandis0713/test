#include <iostream>
#include "../shared_1/global.h"
#include "../shared_2/global.h"
#include "../static_1/global.h"
#include "../static_2/global.h"

#include "../shared_1/static.h"
#include "../shared_2/static.h"
#include "../static_1/static.h"
#include "../static_2/static.h"

#include "../shared_1_with_static_1/global.h"
#include "../shared_2_with_static_1/global.h"
#include "../shared_1_with_static_1/static.h"
#include "../shared_2_with_static_1/static.h"

#include "../static_1_with_static_1/global.h"
#include "../static_2_with_static_1/global.h"
#include "../static_1_with_static_1/static.h"
#include "../static_2_with_static_1/static.h"
using namespace std;


int main()
{
    // /*cout << */get_shared_1_global_num()/* << endl*/;    
    /*cout << */&get_shared_1_global_num_reference()/* << endl*/;
    // /*cout << */get_shared_2_global_num()/* << endl*/;    
    /*cout << */&get_shared_2_global_num_reference()/* << endl*/;
    // /*cout << */get_static_1_global_num()/* << endl*/;    
    /*cout << */&get_static_1_global_num_reference()/* << endl*/;
    // /*cout << */get_static_2_global_num()/* << endl*/;    
    /*cout << */&get_static_2_global_num_reference()/* << endl*/;

    // /*cout << */get_shared_1_static_num()/* << endl*/;    
    /*cout << */&get_shared_1_static_num_reference()/* << endl*/;
    // /*cout << */get_shared_2_static_num()/* << endl*/;    
    /*cout << */&get_shared_2_static_num_reference()/* << endl*/;
    // /*cout << */get_static_1_static_num()/* << endl*/;    
    /*cout << */&get_static_1_static_num_reference()/* << endl*/;
    // /*cout << */get_static_2_static_num()/* << endl*/;    
    /*cout << */&get_static_2_static_num_reference()/* << endl*/;

    // /*cout << */get_shared_1_global_function_with_static_1_global_num()/* << endl*/;
    /*cout << */&get_shared_1_global_function_with_static_1_global_num_reference()/* << endl*/;
    // /*cout << */get_shared_1_global_function_with_static_1_static_num()/* << endl*/;
    /*cout << */&get_shared_1_global_function_with_static_1_static_num_reference()/* << endl*/;
    // /*cout << */get_shared_2_global_function_with_static_1_global_num()/* << endl*/;
    /*cout << */&get_shared_2_global_function_with_static_1_global_num_reference()/* << endl*/;
    // /*cout << */get_shared_2_global_function_with_static_1_static_num()/* << endl*/;
    /*cout << */&get_shared_2_global_function_with_static_1_static_num_reference()/* << endl*/;

    // /*cout << */get_static_1_global_function_with_static_1_global_num()/* << endl*/;
    /*cout << */&get_static_1_global_function_with_static_1_global_num_reference()/* << endl*/;
    // /*cout << */get_static_1_global_function_with_static_1_static_num()/* << endl*/;
    /*cout << */&get_static_1_global_function_with_static_1_static_num_reference()/* << endl*/;
    // /*cout << */get_static_2_global_function_with_static_1_global_num()/* << endl*/;
    /*cout << */&get_static_2_global_function_with_static_1_global_num_reference()/* << endl*/;
    // /*cout << */get_static_2_global_function_with_static_1_static_num()/* << endl*/;
    /*cout << */&get_static_2_global_function_with_static_1_static_num_reference()/* << endl*/;

    cout << &static_1_class::get_instance() << endl;
    static_1_with_static_1_class st_1_w_s_1_class;
    static_2_with_static_1_class st_2_w_s_1_class;
    shared_1_with_static_1_class sh_1_w_s_1_class;
    shared_2_with_static_1_class sh_2_w_s_1_class;

    
    return 0;
}