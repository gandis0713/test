inline bool NOT(bool a)
{
    return !a;
}

inline bool OR(bool a, bool b)
{
    return a | b;
}

inline bool XOR(bool a, bool b)
{
    return a ^ b;
}

inline bool NOR(bool a, bool b)
{
    return !OR(a, b);
}
inline bool XNOR(bool a, bool b)
{
    return !XOR(a, b);
}

inline bool AND(bool a, bool b)
{
    return a & b;
}

inline bool NAND(bool a, bool b)
{
    return !AND(a, b);
}