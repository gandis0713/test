#include "matrix4.h"

Matrix4::Matrix4()
{
    _element[0][0] = 1;
    _element[0][1] = 0;
    _element[0][2] = 0;
    _element[0][3] = 0;
    _element[1][0] = 0;
    _element[1][1] = 1;
    _element[1][2] = 0;
    _element[1][3] = 0;
    _element[2][0] = 0;
    _element[2][1] = 0;
    _element[2][2] = 1;
    _element[2][3] = 0;
    _element[3][0] = 0;
    _element[3][1] = 0;
    _element[3][2] = 0;
    _element[3][3] = 1;   
}

Matrix4::Matrix4(const Vector4& row0,
                 const Vector4& row1,
                 const Vector4& row2,
                 const Vector4& row3)
{
    _element[0] = row0;
    _element[1] = row1;
    _element[2] = row2;
    _element[3] = row3;
}

Matrix4::~Matrix4()
{
    
}
