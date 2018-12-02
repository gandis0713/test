#include "../../DataStructure/InputOutput.h"

struct SAdderOut
{
    SOutput carry;
    SOutput sum;
};

typedef SInput_2 SHalfAdderIn;

struct SAdderIn
{
    SHalfAdderIn sHalfAdderIn;
    SInput carry;
};

namespace NAdder
{
    SAdderOut DoFullAdder(const SAdderIn &sAdderIn);
    SAdderOut DoHalfAdder(const SHalfAdderIn &sHalfAdderIn);
}