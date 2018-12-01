#include "LogicCircuit/NHalfAdder.h"

#include <iostream>
using namespace std;

int main()
{
    STwoInput sTwoInput;
    sTwoInput.input_1 = true;
    sTwoInput.input_2 = true;


    SHalfAdder sHalfAdder = NHalfAdder::Do(sTwoInput);

    cout << sHalfAdder.sum << endl;
    cout << sHalfAdder.carry << endl;
    return 0;
}