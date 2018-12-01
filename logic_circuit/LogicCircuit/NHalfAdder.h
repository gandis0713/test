#include "../DLogicGate.h"
#include "../DLogicStruct.h"

struct SHalfAdder
{
    Output carry;
    Output sum;
};

namespace NHalfAdder
{
    SHalfAdder Do(const Input_2 &input_2);
}