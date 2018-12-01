#include "LogicCircuit/NHalfAdder.h"

#include <iostream>

using namespace std;

int main()
{
    Input_2 input_2;
    input_2.set();
    input_2[0] = 0;

    SHalfAdder sHalfAdder = NHalfAdder::Do(input_2);

    cout << sHalfAdder.sum << endl;
    cout << sHalfAdder.carry << endl;

    return 0;
}