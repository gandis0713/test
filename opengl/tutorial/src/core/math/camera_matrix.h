#ifndef CAMERA_MATRIX_H
#define CAMERA_MATRIX_H

#include "matrix4.h"

class CameraMatrix : public Matrix4
{
public:
    explicit CameraMatrix();
    virtual ~CameraMatrix();
};


#endif