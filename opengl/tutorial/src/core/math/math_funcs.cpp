#include "math_funcs.h"
#include <math.h>

float Math::sqrt(float value)
{
    return ::sqrtf(value);
}

double Math::sqrt(double value)
{
    return ::sqrt(value);
}

float Math::absf(float value)
{
    /*
    union
    {
        float f;
        uint32_t i;
    } u;

    u.f = value;
    u.i &= 2147483647u;
    */

    union
    {
        struct
        {
            unsigned m;
            unsigned e;
            unsigned s;
        };

        float f;            
    }u;
    
    u.f = value;
    u.s = 0;
    
    return u.f;
}

double Math::absd(double value)
{
    /*
    union {
        double d;
        uint64_t i;
    } u;
    u.d = value;
    u.i &= (uint64_t)9223372036854775807ll;
    */

    union 
    {
        struct 
        {
            unsigned t;
            unsigned m : 20;
            unsigned e : 11;
            unsigned s : 1;
        };            
        double d;
    }u;
    u.d = value;
    u.s = 0;

    return u.d;
}

float Math::abs(float value)
{
    return absf(value);
}

double Math::abs(double value)
{
    return absd(value);
}

bool Math::is_equal_approx(const real_t& a, const real_t& b)
{
    if(a == b)
        return true;
    real_t tolerance = EPSILON * abs(a);
    tolerance = tolerance < EPSILON ? EPSILON : tolerance;

    return abs(a - b) < tolerance;
}

bool Math::is_equal_approx(const real_t& a, const real_t& b, const real_t& tolerance)
{
    if(a == b)
        return true;
    
    return abs(a - b) < tolerance;
}