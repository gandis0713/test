#ifndef MATRIX3_H
#define MATRIX3_h

#include "vector3.h"
#include "math_def.h"

// The elements of the matrix are stored as row major order.
/*
 |  0  1  2 |
 |  3  4  5 |
 |  6  7  8 |
 */

class Matrix3
{
protected:
    Vector3 _element[3];

public:
    explicit Matrix3();
    explicit Matrix3(const Vector3& row0, const Vector3& row1, const Vector3& row2);
    virtual ~Matrix3();

    __INLINE__ void set(const Vector3& row0, const Vector3& row1, const Vector3& row2);

    __INLINE__ const Vector3& operator[](int axis) const;
    __INLINE__ Vector3& operator[](int axis);
};

void Matrix3::set(const Vector3& row0, const Vector3& row1, const Vector3& row2)
{
    _element[0] = row0;
    _element[1] = row1;
    _element[2] = row2;
}

const Vector3& Matrix3::operator[](int axis) const
{
    return _element[axis];
}

Vector3& Matrix3::operator[](int axis)
{
    return _element[axis];
}

#endif