#ifndef VECTOR3_H
#define VECTOR3_H

#include "math_def.h"
#include "type_def.h"

class Vector3
{
public:
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

public:
    Vector3(real_t x, real_t y, real_t z) : x(x), y(y), z(z) {}
    Vector3() : x(0), y(0), z(0) {}

    __INLINE__ const real_t &operator[](int axis) const;
    __INLINE__ real_t &operator[](int axis);

    __INLINE__ Vector3& operator+=(const real_t& v);
    __INLINE__ Vector3& operator-=(const real_t& v);
    __INLINE__ Vector3& operator*=(const real_t& v);
    __INLINE__ Vector3& operator/=(const real_t& v);

    __INLINE__ bool operator==(const Vector3& v) const;
    __INLINE__ bool operator!=(const Vector3& v) const;

    __INLINE__ Vector3 operator+(const real_t& v) const;
    __INLINE__ Vector3 operator-(const real_t& v) const;
    __INLINE__ Vector3 operator*(const real_t& v) const;
    __INLINE__ Vector3 operator/(const real_t& v) const;

    __INLINE__ Vector3 operator+(const Vector3& v) const;
    __INLINE__ Vector3 operator-(const Vector3& v) const;
    __INLINE__ Vector3 operator*(const Vector3& v) const;
    __INLINE__ Vector3 operator/(const Vector3& v) const;
    
    __INLINE__ Vector3 operator-() const;
};

#endif