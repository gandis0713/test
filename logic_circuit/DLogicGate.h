#include "DLogicStruct.h"

inline Input NOT(Input input)
{
    return !input[0];
}

inline bool OR(Input_2 inputs)
{
    return inputs[0] | inputs[1];
}

inline bool XOR(Input_2 inputs)
{
    return inputs[0] ^ inputs[1];
}

inline bool NOR(Input_2 inputs)
{
    return !OR(inputs);
}

inline bool XNOR(Input_2 inputs)
{
    return !XOR(inputs);
}

inline bool AND(Input_2 inputs)
{
    return inputs[0] & inputs[1];
}

inline bool NAND(Input_2 inputs)
{
    return !AND(inputs);
}