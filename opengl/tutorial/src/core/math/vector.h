#ifndef VECTOR_H
#define VECTOR_H

#include "math_def.h"
#include "core/type_def.h"

class vector3
{
    union 
    {
        struct
        {
            real_t x;
            real_t y;
            real_t z;
        };

        real_t coord[3];
    };

    INLINE const real_t &operator[](int axis) const
    {
        return coord[axis];
    }

    INLINE real_t &operator[](int axis)
    {
        return coord[axis];
    }
};

#endif