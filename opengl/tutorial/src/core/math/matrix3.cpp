#include "matrix3.h"

Matrix3::Matrix3()
{
    _element[0][0] = 1;
    _element[0][1] = 0;
    _element[0][2] = 0;
    _element[1][0] = 0;
    _element[1][1] = 1;
    _element[1][2] = 0;
    _element[2][0] = 0;
    _element[2][1] = 0;
    _element[2][2] = 1;
}

Matrix3::Matrix3(const Vector3& row0, const Vector3& row1, const Vector3& row2)
{
    _element[0] = row0;
    _element[1] = row1;
    _element[2] = row2;
}

Matrix3::~Matrix3()
{

}