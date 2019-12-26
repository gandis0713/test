#include "vector4.h"
#include "math_funcs.h"

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
    return Vector4(this->x + v, this->y + v, this->z + v);
}

Vector4 Vector4::operator-(const real_t& v) const
{
    return Vector4(this->x - v, this->y - v, this->z - v);
}

Vector4 Vector4::operator*(const real_t& v) const
{
    return Vector4(this->x * v, this->y * v, this->z * v);
}

Vector4 Vector4::operator/(const real_t& v) const
{
    return Vector4(this->x / v, this->y / v, this->z / v);
}

Vector4 Vector4::operator+(const Vector4& v) const
{
    return Vector4(this->x + v.x, this->y + v.y, this->z + v.z);
}

Vector4 Vector4::operator-(const Vector4& v) const
{
    return Vector4(this->x - v.x, this->y - v.y, this->z - v.z);
}

Vector4 Vector4::operator*(const Vector4& v) const
{
    return Vector4(this->x * v.x, this->y * v.y, this->z * v.z);
}

Vector4 Vector4::operator/(const Vector4& v) const
{
    return Vector4(this->x / v.x, this->y / v.y, this->z / v.z);
}

Vector4 Vector4::operator-() const
{
    return Vector4(-this->x, -this->y, -this->z);
}

real_t Vector4::dot(const Vector4& v) const
{
    return x * v.x + y * v.y + z * v.z;
}

Vector4 Vector4::cross(const Vector4& v) const
{
    return Vector4(x * v.y - y * v.x,
                   y * v.z - z * v.y,
                   z * v.x - x * v.z);
}

real_t Vector4::length() const
{
    return Math::sqrt(x * x + y * y + z * z);
}