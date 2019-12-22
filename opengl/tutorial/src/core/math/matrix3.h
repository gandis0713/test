#ifndef MATRIX3_H
#define MATRIX3_h

#include "math_def.h"

class Matrix3
{
protected:
    real_t _mat[3][3];

public:
    explicit Matrix3();
    virtual ~Matrix3();
};

#endif