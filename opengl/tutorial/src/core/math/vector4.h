#ifndef VECTOR4_H
#define VECTOR4_H

#include "math_def.h"
#include "type_def.h"

class Vector4
{
public:
    union 
    {
        struct
        {
            real_t x;
            real_t y;
            real_t z;
            real_t w;
        };

        real_t coord[4];
    };

public:
    Vector4(real_t x, real_t y, real_t z, real_t w) : x(x), y(y), z(z), w(w) {}
    Vector4() : x(0.0), y(0.0), z(0.0), w(1.0) {}

    __INLINE__ const real_t &operator[](int axis) const;
    __INLINE__ real_t &operator[](int axis);

    Vector4& operator+=(const real_t& value);
    Vector4& operator-=(const real_t& value);
    Vector4& operator*=(const real_t& value);
    Vector4& operator/=(const real_t& value);
};

#endif