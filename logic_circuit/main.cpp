#include "LogicCircuit/NAdder.h"
#include "DDataType.h"

#include <iostream>
#include <vector>

using namespace std;

int main()
{
    SInt nNumber_1;
    SInt nNumber_2;
    SInt nSum;
    nNumber_1.reset();
    nNumber_2.reset();
    nSum.reset();

    // set 23
    nNumber_1[0] = 1;
    nNumber_1[1] = 1;
    nNumber_1[2] = 1;
    nNumber_1[3] = 0;
    nNumber_1[4] = 1;
    
    // set 27
    nNumber_2[0] = 1;
    nNumber_2[1] = 1;
    nNumber_2[2] = 0;
    nNumber_2[3] = 1;
    nNumber_2[4] = 1;
    
    cout << "nNumber_1 : " << nNumber_1.to_ulong() << endl;    
    cout << "nNumber_2 : " << nNumber_2.to_ulong() << endl;

    SAdderIn sAdderIn;
    sAdderIn.sHalfAdderIn.x[0] = nNumber_1[0];
    sAdderIn.sHalfAdderIn.y[0] = nNumber_2[0];
    sAdderIn.carry[0] = 0;

    SAdderOut sAdderOut;
    for(int nIndex = 1; nIndex < (INT_BIT_SIZE - 1); nIndex++)
    {
        sAdderOut = NAdder::DoFullAdder(sAdderIn);

        sAdderIn.carry[0] = sAdderOut.carry[0];
        sAdderIn.sHalfAdderIn.x[0] = nNumber_1[nIndex];
        sAdderIn.sHalfAdderIn.y[0] = nNumber_2[nIndex];

        nSum[nIndex - 1] = sAdderOut.sum[0];   
    }

    nSum[INT_BIT_SIZE - 1] = sAdderOut.carry[0];

    cout << nSum.to_ulong() << endl;


    return 0;
}