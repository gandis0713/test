#ifndef VECTOR3_H
#define VECTOR3_H

#include "math_def.h"
#include "type_def.h"
#include "math_funcs.h"

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
    virtual ~Vector3(){}

    __INLINE__ const real_t& operator[](int axis) const;
    __INLINE__ real_t& operator[](int axis);

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

    __INLINE__ real_t dot(const Vector3 &v) const;
    __INLINE__ Vector3 cross(const Vector3 &v) const;
    __INLINE__ real_t length() const;
};

const real_t& Vector3::operator[](int axis) const
{
    return coord[axis];
}

real_t& Vector3::operator[](int axis)
{
    return coord[axis];
}

Vector3& Vector3::operator+=(const real_t& v)
{
    this->x += v;
    this->y += v;
    this->z += v;

    return *this;
}

Vector3& Vector3::operator-=(const real_t& v)
{
    this->x -= v;
    this->y -= v;
    this->z -= v;

    return *this;
}

Vector3& Vector3::operator*=(const real_t& v)
{
    this->x *= v;
    this->y *= v;
    this->z *= v;

    return *this;
}

Vector3& Vector3::operator/=(const real_t& v)
{
    this->x /= v;
    this->y /= v;
    this->z /= v;

    return *this;
}

bool Vector3::operator==(const Vector3& v) const
{
    return Math::is_equal_approx(x, v.x) 
        && Math::is_equal_approx(y, v.y) 
        && Math::is_equal_approx(z, v.z);
}

bool Vector3::operator!=(const Vector3& v) const
{
    return !Math::is_equal_approx(x, v.x)
        || !Math::is_equal_approx(y, v.y)
        || !Math::is_equal_approx(z, v.z);
}

Vector3 Vector3::operator+(const real_t& v) const
{
    return Vector3(this->x + v, this->y + v, this->z + v);
}

Vector3 Vector3::operator-(const real_t& v) const
{
    return Vector3(this->x - v, this->y - v, this->z - v);
}

Vector3 Vector3::operator*(const real_t& v) const
{
    return Vector3(this->x * v, this->y * v, this->z * v);
}

Vector3 Vector3::operator/(const real_t& v) const
{
    return Vector3(this->x / v, this->y / v, this->z / v);
}

Vector3 Vector3::operator+(const Vector3& v) const
{
    return Vector3(this->x + v.x, this->y + v.y, this->z + v.z);
}

Vector3 Vector3::operator-(const Vector3& v) const
{
    return Vector3(this->x - v.x, this->y - v.y, this->z - v.z);
}

Vector3 Vector3::operator*(const Vector3& v) const
{
    return Vector3(this->x * v.x, this->y * v.y, this->z * v.z);
}

Vector3 Vector3::operator/(const Vector3& v) const
{
    return Vector3(this->x / v.x, this->y / v.y, this->z / v.z);
}

Vector3 Vector3::operator-() const
{
    return Vector3(-this->x, -this->y, -this->z);
}

real_t Vector3::dot(const Vector3& v) const
{
    return x * v.x + y * v.y + z * v.z;
}

Vector3 Vector3::cross(const Vector3& v) const
{
    return Vector3(x * v.y - y * v.x,
                   y * v.z - z * v.y,
                   z * v.x - x * v.z);
}

real_t Vector3::length() const
{
    return Math::sqrt(x * x + y * y + z * z);
}

#endif