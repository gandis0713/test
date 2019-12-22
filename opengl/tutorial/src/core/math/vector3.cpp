#include "vector3.h"
#include "math_funcs.h"

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