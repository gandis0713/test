#ifndef MATRIX4_H
#define MATRIX4_H

#include "math_def.h"
#include "vector4.h"

class Matrix4
{
protected:
    union 
    {
        struct
        {
            Vector4 x;
            Vector4 y;
            Vector4 z;
            Vector4 w;
        };
        
        Vector4 _mat[4];
    };
    // real_t _mat[4][4];

public:
    explicit Matrix4();
    virtual ~Matrix4();
};

#endif