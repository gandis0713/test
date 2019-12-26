#ifndef MATH_FUNCS_H
#define MATH_FUNCS_H

#include "type_def.h"
#include "math_def.h"

#include <stdint.h>

class Math
{
public:
    static __FORCE_INLINE__ float sqrt(float value);
    static __FORCE_INLINE__ double sqrt(double value);

    static __FORCE_INLINE__ float absf(float value);
    static __FORCE_INLINE__ double absd(double value);
    
    static __FORCE_INLINE__ float abs(float value);
    static __FORCE_INLINE__ double abs(double value);
    
    static __FORCE_INLINE__ bool is_equal_approx(const real_t& a, const real_t& b);
    static __FORCE_INLINE__ bool is_equal_approx(const real_t& a, const real_t& b, const real_t& tolerance);
};

#endif