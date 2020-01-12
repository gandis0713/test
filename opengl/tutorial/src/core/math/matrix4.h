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
    Vector4 _element[4];

public:
    explicit Matrix4();
    explicit Matrix4(const Vector4& row0,
                     const Vector4& row1,
                     const Vector4& row2,
                     const Vector4& row3);
    virtual ~Matrix4();

    void set(const Vector4& row0,
             const Vector4& row1,
             const Vector4& row2,
             const Vector4& row3);

    const Vector4& operator[](int axis) const;
    Vector4& operator[](int axis);
};

__INLINE__ void Matrix4::set(const Vector4& row0,
                             const Vector4& row1,
                             const Vector4& row2,
                             const Vector4& row3)
{
    _element[0] = row0;
    _element[1] = row1;
    _element[2] = row2;
    _element[3] = row3;   
}

__INLINE__ const Vector4& Matrix4::operator[](int axis) const 
{
    return _element[axis];
}

__INLINE__ Vector4& Matrix4::operator[](int axis)
{
    return _element[axis];
}

#endif