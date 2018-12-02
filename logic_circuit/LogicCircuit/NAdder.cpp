#include "NAdder.h"

namespace NAdder
{
    
    SAdderOut DoFullAdder(const SAdderIn &sAdderIn)
    {
        SAdderOut sHalfAdderOut_1;

        sHalfAdderOut_1 = DoHalfAdder(sAdderIn.sHalfAdderIn);

        SHalfAdderIn sHalfAdderIn_2;
        sHalfAdderIn_2.x = sHalfAdderOut_1.sum;
        sHalfAdderIn_2.y = sAdderIn.carry;

        
        SAdderOut sHalfAdderOut_2;
        sHalfAdderOut_2 = DoHalfAdder(sHalfAdderIn_2);

        SInput_2 SInputs;
        SInputs.x = sHalfAdderOut_1.carry;
        SInputs.y = sHalfAdderOut_2.carry;

        SAdderOut sFullAdderOut;
        sFullAdderOut.sum = sHalfAdderOut_2.sum;
        sFullAdderOut.carry = XOR(SInputs);

        return sFullAdderOut;
    }

    SAdderOut DoHalfAdder(const SHalfAdderIn &sHalfAdderIn)
    {
        SAdderOut sAdderOut;

        sAdderOut.sum = XOR(sHalfAdderIn);
        sAdderOut.carry = AND(sHalfAdderIn);

        return sAdderOut;
    }
}