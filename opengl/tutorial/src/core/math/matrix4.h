#ifndef MATRIX4_H
#define MATRIX4_H

#include "math_def.h"

class Matrix4
{
protected:
    real_t _mat[4][4];

public:
    explicit Matrix4();
    virtual ~Matrix4();
};

#endif