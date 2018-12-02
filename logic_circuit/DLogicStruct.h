#pragma once

#include <bitset>

using namespace std;

typedef bitset<1> SBit;
typedef bitset<2> SBit_2;
typedef bitset<8> SBit_8;
typedef bitset<16> SBit_16;
typedef bitset<32> SBit_32;

typedef SBit SInput;
typedef SBit SOutput;

struct SInput_2
{
    SInput x;
    SInput y;
};

struct SOutput_2
{
    SOutput x;
    SOutput y;
};
