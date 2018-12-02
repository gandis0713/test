#include "../DLogicGate.h"
#include "../DLogicStruct.h"

struct SAdderOutput
{
    SOutput carry;
    SOutput sum;
};

typedef SInput_2 SHalfAdderInput;

struct SAdderInput
{
    SHalfAdderInput sHAInput;
    SInput carry;
};


namespace NAdder
{
    SAdderOutput DoFullAdder(const SAdderInput &sAdderInput);
    SAdderOutput DoHalfAdder(const SHalfAdderInput &sHalfAdderInput);
}