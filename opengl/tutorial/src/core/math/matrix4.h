#ifndef MATRIX4_H
#define MATRIX4_H

#include "math_def.h"
#include "vector4.h"

// The elements of the matrix are stored as row major order.
/*
 |  0  1  2  3 |
 |  4  5  6  7 |
 |  8  9 10 11 |
 | 12 13 14 15 |
 */

class Matrix4
{
protected:
    Vector4 _mat[4];

public:
    explicit Matrix4(){}
    virtual ~Matrix4(){}

    __INLINE__ const Vector4& operator[](int axis) const;
    __INLINE__ Vector4& operator[](int axis);
};

#endif