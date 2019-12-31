#include <iostream>
#include "../shared_1/global.h"
#include "../shared_2/global.h"
#include "../static_1/global.h"
#include "../static_2/global.h"
using namespace std;


int main()
{
    cout << get_shared_1_global_num() << endl;    
    cout << get_shared_1_global_num_reference() << endl;
    cout << get_shared_2_global_num() << endl;    
    cout << get_shared_2_global_num_reference() << endl;
    cout << get_static_1_global_num() << endl;    
    cout << get_static_1_global_num_reference() << endl;
    cout << get_static_2_global_num() << endl;    
    cout << get_static_2_global_num_reference() << endl;
    
    return 0;
}