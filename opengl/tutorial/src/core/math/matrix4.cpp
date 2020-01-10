#include "matrix4.h"


const Vector4& Matrix4::operator[](int axis) const { return _mat[axis]; }
Vector4& Matrix4::operator[](int axis) { return _mat[axis]; }