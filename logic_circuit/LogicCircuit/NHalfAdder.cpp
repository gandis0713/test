#include "NHalfAdder.h"

namespace NAdder
{
    
    SAdderOutput DoFullAdder(const SAdderInput &sAdderInput)
    {
        SAdderOutput sHalfAdderOut_1;

        sHalfAdderOut_1 = DoHalfAdder(sAdderInput.sHAInput);

        SHalfAdderInput sHalfAdderIn_2;
        sHalfAdderIn_2.x = sHalfAdderOut_1.sum;
        sHalfAdderIn_2.y = sAdderInput.carry;

        
        SAdderOutput sHalfAdderOut_2;
        sHalfAdderOut_2 = DoHalfAdder(sHalfAdderIn_2);

        SInput_2 SInputs;
        SInputs.x = sHalfAdderOut_1.carry;
        SInputs.y = sHalfAdderOut_2.carry;

        SAdderOutput sFullAdderOut;
        sFullAdderOut.sum = sHalfAdderOut_2.sum;
        sFullAdderOut.carry = XOR(SInputs);

        return sFullAdderOut;
    }

    SAdderOutput DoHalfAdder(const SHalfAdderInput &sHalfAdderInput)
    {
        SAdderOutput sAdderOutput;

        sAdderOutput.sum = XOR(sHalfAdderInput);
        sAdderOutput.carry = AND(sHalfAdderInput);

        return sAdderOutput;
    }
}