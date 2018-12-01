#include "NHalfAdder.h"

namespace NHalfAdder
{
    SHalfAdder Do(const Input_2 &input_2)
    {
        SHalfAdder sHalfAdder;

        sHalfAdder.sum = XOR(input_2);
        sHalfAdder.carry = AND(input_2);

        return sHalfAdder;
    }
}