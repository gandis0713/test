#include "glwidget.h"

#include "pathmanager.h"

#include <sstream>
#include <fstream>


GLuint GLWidget::LoadShaders(const char* pVertexFilePath, const char* pFragFilePath)
{
    // 쉐이더들 생성
    GLuint VertexShaderID = glCreateShader(GL_VERTEX_SHADER);
    GLuint FragmentShaderID = glCreateShader(GL_FRAGMENT_SHADER);

    // 버텍스 쉐이더 코드를 파일에서 읽기
    std::ifstream vertexShaderStream(pVertexFilePath);
    std::string strVertexShaderCode;
    if(vertexShaderStream.is_open()){
        std::stringstream strStream;
        strStream << vertexShaderStream.rdbuf();
        strVertexShaderCode = strStream.str();
        vertexShaderStream.close();
    }else{
        qDebug() << " vertex code not open";
        getchar();
        return 0;
    }

    // 프래그먼트 쉐이더 코드를 파일에서 읽기
    std::ifstream fragmentShaderStream(pFragFilePath);
    std::string strFragmentShaderCode;
    if(fragmentShaderStream.is_open()){
        std::stringstream strStream;
        strStream << fragmentShaderStream.rdbuf();
        strFragmentShaderCode = strStream.str();
        fragmentShaderStream.close();
    }
    else
    {
        qDebug() << " fragment code not open";
    }

    GLint nResult = GL_FALSE;
    int nInfoLogLength;

    // 버텍스 쉐이더를 컴파일
    const char* pVertexSource = strVertexShaderCode.c_str();
    glShaderSource(VertexShaderID, 1, &pVertexSource , NULL);
    glCompileShader(VertexShaderID);

    // 버텍스 쉐이더를 검사
    glGetShaderiv(VertexShaderID, GL_COMPILE_STATUS, &nResult);
    glGetShaderiv(VertexShaderID, GL_INFO_LOG_LENGTH, &nInfoLogLength);
    if ( nInfoLogLength > 0 ){
        std::vector<char> vecVertexShaderErrorMessage(nInfoLogLength + 1);
        glGetShaderInfoLog(VertexShaderID, nInfoLogLength, NULL, &vecVertexShaderErrorMessage[0]);
        qDebug() << "vertex shader : " << &vecVertexShaderErrorMessage[0];
    }

    // 프래그먼트 쉐이더를 컴파일s
    const char* pFragmentSource = strFragmentShaderCode.c_str();
    glShaderSource(FragmentShaderID, 1, &pFragmentSource , NULL);
    glCompileShader(FragmentShaderID);

    // 프래그먼트 쉐이더를 검사
    glGetShaderiv(FragmentShaderID, GL_COMPILE_STATUS, &nResult);
    glGetShaderiv(FragmentShaderID, GL_INFO_LOG_LENGTH, &nInfoLogLength);
    if ( nInfoLogLength > 0 ){
        std::vector<char> vecFragmentShaderErrorMessage(nInfoLogLength + 1);
        glGetShaderInfoLog(FragmentShaderID, nInfoLogLength, NULL, &vecFragmentShaderErrorMessage[0]);
        qDebug() << "fragment shader : " << &vecFragmentShaderErrorMessage[0];
    }

    // 프로그램에 링크
    GLuint nProgramID = glCreateProgram();
    glAttachShader(nProgramID, VertexShaderID);
    glAttachShader(nProgramID, FragmentShaderID);

    glLinkProgram(nProgramID);

    // 프로그램 검사
    glGetProgramiv(nProgramID, GL_LINK_STATUS, &nResult);
    glGetProgramiv(nProgramID, GL_INFO_LOG_LENGTH, &nInfoLogLength);
    if ( nInfoLogLength > 0 ){
        std::vector<char> ProgramErrorMessage(nInfoLogLength+1);
        glGetProgramInfoLog(nProgramID, nInfoLogLength, NULL, &ProgramErrorMessage[0]);
        qDebug() << 2 << &ProgramErrorMessage[0];
    }


    glDetachShader(nProgramID, VertexShaderID);
    glDetachShader(nProgramID, FragmentShaderID);

    glDeleteShader(VertexShaderID);
    glDeleteShader(FragmentShaderID);

    return nProgramID;
}

static const GLfloat g_vertex_buffer_data[] =
{
    -1.0f, -1.0f, 0.0f, 1.0,
    1.0f, -1.0f, 0.0f, 1.0,
    0.0f,  1.0f, 0.0f, 1.0,
    1.0f, -1.0f, 0.0f, 1.0,
    3.0f, -1.0f, 0.0f, 1.0,
    2.0f,  1.0f, 0.0f, 1.0
};


GLWidget::GLWidget(QWidget *parent)
    : QGLWidget (parent)
{
    qDebug() << __FUNCTION__;

}

GLWidget::~GLWidget()
{
    qDebug() << __FUNCTION__;
}


void GLWidget::resizeGL(int w, int h)
{
    qDebug() << __FUNCTION__;

    GLsizei width = w;
    GLsizei height = h;

    glViewport(0, 0, width, height);

    glm::mat4 mat4Projection = glm::perspective(glm::radians(45.0f), (GLfloat)width/(GLfloat)height, 0.1f, 100.0f);
    glm::mat4 mat4View = glm::lookAt(glm::vec3(0,0,10),
                                     glm::vec3(0,0,0),
                                     glm::vec3(0,1,0));
    glm::mat4 mat4Model = glm::mat4(1.0f);

    m_mat4PerViewModel = mat4Projection * mat4View * mat4Model;
}

void GLWidget::initializeGL()
{
    qDebug() << __FUNCTION__;

    initializeOpenGLFunctions();

    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);

    QString strVertexShaderPath = CPathManager::GetInstance().GetGLSLPath() + "/vertex.glsl";
    QString strFragShaderPath = CPathManager::GetInstance().GetGLSLPath() + "/fragment.glsl";
    m_programID = LoadShaders( strVertexShaderPath.toLocal8Bit(), strFragShaderPath.toLocal8Bit());

    m_nMatrixID = glGetUniformLocation(m_programID, "perViewModel");
    m_nVertexID = glGetAttribLocation(m_programID, "vertex");

    glGenBuffers(1, &m_nVerterBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, m_nVerterBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(g_vertex_buffer_data), g_vertex_buffer_data, GL_STATIC_DRAW);

}

void GLWidget::paintGL()
{
    qDebug() << __FUNCTION__;

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();

    glUseProgram(m_programID);

    glUniformMatrix4fv(m_nMatrixID, 1, GL_FALSE, &m_mat4PerViewModel[0][0]);
    glEnableVertexAttribArray(m_nVertexID);
    glBindBuffer(GL_ARRAY_BUFFER, m_nVerterBuffer);
    glVertexAttribPointer
            (
                0,
                4,
                GL_FLOAT,
                GL_FALSE,
                0,
                (void*)0
                );

    glDrawArrays(GL_TRIANGLES, 0, 6);
    glDisableVertexAttribArray(m_nVertexID);
}
