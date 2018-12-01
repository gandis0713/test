#include "NHalfAdder.h"

namespace NHalfAdder
{
    SHalfAdder Do(const STwoInput &sTwoInput)
    {
        SHalfAdder sHalfAdder;

        sHalfAdder.sum = XOR(sTwoInput.input_1, sTwoInput.input_2);
        sHalfAdder.carry = AND(sTwoInput.input_1, sTwoInput.input_2);

        return sHalfAdder;
    }
}