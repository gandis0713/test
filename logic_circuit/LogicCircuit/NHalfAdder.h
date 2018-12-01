#include "../DLogicGate.h"
#include "../DLogicStruct.h"

struct SHalfAdder
{
    bool carry;
    bool sum;
};

namespace NHalfAdder
{
    SHalfAdder Do(const STwoInput &sTwoInput);
}