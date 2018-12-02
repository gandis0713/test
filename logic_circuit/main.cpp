#include "LogicCircuit/NHalfAdder.h"

#include <iostream>

using namespace std;

int main()
{
    SAdderInput sAdderIn;
    sAdderIn.carry = 0;
    sAdderIn.sHAInput.x[0] = 1;
    sAdderIn.sHAInput.y[0] = 1;

    SAdderOutput sAdderOut = NAdder::DoFullAdder(sAdderIn);

    cout << sAdderOut.sum << endl;
    cout << sAdderOut.carry << endl;

    return 0;
}