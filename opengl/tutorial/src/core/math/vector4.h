#ifndef VECTOR4_H
#define VECTOR4_H

#include "math_def.h"
#include "type_def.h"
#include "math_funcs.h"

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
    virtual ~Vector4(){}

    __INLINE__ const real_t& operator[](int axis) const;
    __INLINE__ real_t& operator[](int axis);

    __INLINE__ Vector4& operator+=(const real_t& v);
    __INLINE__ Vector4& operator-=(const real_t& v);
    __INLINE__ Vector4& operator*=(const real_t& v);
    __INLINE__ Vector4& operator/=(const real_t& v);

    __INLINE__ bool operator==(const Vector4& v) const;
    __INLINE__ bool operator!=(const Vector4& v) const;

    __INLINE__ Vector4 operator+(const real_t& v) const;
    __INLINE__ Vector4 operator-(const real_t& v) const;
    __INLINE__ Vector4 operator*(const real_t& v) const;
    __INLINE__ Vector4 operator/(const real_t& v) const;

    __INLINE__ Vector4 operator+(const Vector4& v) const;
    __INLINE__ Vector4 operator-(const Vector4& v) const;
    __INLINE__ Vector4 operator*(const Vector4& v) const;
    __INLINE__ Vector4 operator/(const Vector4& v) const;
    
    __INLINE__ Vector4 operator-() const;

    __INLINE__ real_t dot(const Vector4 &v) const;
    __INLINE__ real_t length() const;
};

const real_t& Vector4::operator[](int axis) const
{
    return coord[axis];
}

real_t& Vector4::operator[](int axis)
{
    return coord[axis];
}

Vector4& Vector4::operator+=(const real_t& v)
{
    this->x += v;
    this->y += v;
    this->z += v;

    return *this;
}

Vector4& Vector4::operator-=(const real_t& v)
{
    this->x -= v;
    this->y -= v;
    this->z -= v;

    return *this;
}

Vector4& Vector4::operator*=(const real_t& v)
{
    this->x *= v;
    this->y *= v;
    this->z *= v;

    return *this;
}

Vector4& Vector4::operator/=(const real_t& v)
{
    this->x /= v;
    this->y /= v;
    this->z /= v;

    return *this;
}

bool Vector4::operator==(const Vector4& v) const
{
    return Math::is_equal_approx(x, v.x) 
        && Math::is_equal_approx(y, v.y) 
        && Math::is_equal_approx(z, v.z);
}

bool Vector4::operator!=(const Vector4& v) const
{
    return !Math::is_equal_approx(x, v.x)
        || !Math::is_equal_approx(y, v.y)
        || !Math::is_equal_approx(z, v.z);
}

Vector4 Vector4::operator+(const real_t& v) const
{
    return Vector4(this->x + v, this->y + v, this->z + v, this->w + v);
}

Vector4 Vector4::operator-(const real_t& v) const
{
    return Vector4(this->x - v, this->y - v, this->z - v, this->w - v);
}

Vector4 Vector4::operator*(const real_t& v) const
{
    return Vector4(this->x * v, this->y * v, this->z * v, this->w * v);
}

Vector4 Vector4::operator/(const real_t& v) const
{
    return Vector4(this->x / v, this->y / v, this->z / v, this->w / v);
}

Vector4 Vector4::operator+(const Vector4& v) const
{
    return Vector4(this->x + v.x, this->y + v.y, this->z + v.z, this->w + v.w);
}

Vector4 Vector4::operator-(const Vector4& v) const
{
    return Vector4(this->x - v.x, this->y - v.y, this->z - v.z, this-> w - v.w);
}

Vector4 Vector4::operator*(const Vector4& v) const
{
    return Vector4(this->x * v.x, this->y * v.y, this->z * v.z, this->w * v.w);
}

Vector4 Vector4::operator/(const Vector4& v) const
{
    return Vector4(this->x / v.x, this->y / v.y, this->z / v.z, this->w / v.w);
}

Vector4 Vector4::operator-() const
{
    return Vector4(-this->x, -this->y, -this->z, -this->w);
}

real_t Vector4::dot(const Vector4& v) const
{
    return x * v.x + y * v.y + z * v.z + w * v.w;
}

real_t Vector4::length() const
{
    return Math::sqrt(x * x + y * y + z * z);
}

#endif