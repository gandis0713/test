#ifndef GLWINDOW_H
#define GLWINDOW_H

#include "qtheader.h"

#include "glm.hpp"
#include "gtc/matrix_transform.hpp"

class GLWidget : public QGLWidget, protected QOpenGLFunctions_3_1
{
    Q_OBJECT
public:
    explicit GLWidget(QWidget *parent = nullptr);
    ~GLWidget();

protected:
    void resizeGL(int w, int h) override;
    void initializeGL() override;
    void paintGL() override;

private:
    GLuint LoadShaders(const char* pVertexFilePath,const char* pFragFilePath);

private:
    GLuint m_programID;
    GLuint m_nMatrixID;
    GLuint m_nVertexID;
    GLuint m_nVerterBuffer;

    glm::mat4 m_mat4PerViewModel;

signals:

public slots:
};

#endif // GLWINDOW_H
