#ifndef SHADER_H
#define SHADER_H

#include "glad/glad.h"

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

class Shader
{
public:
    explicit Shader();
    virtual ~Shader();

    void setShader(const char* vertexPath, const char* fragmentPath);

    inline void use() 
    { 
        glUseProgram(m_nID); 
    }
    inline void setBool(const std::string &name, bool value) const
    {         
        glUniform1i(glGetUniformLocation(m_nID, name.c_str()), (int)value); 
    }
    inline void setInt(const std::string &name, int value) const
    { 
        glUniform1i(glGetUniformLocation(m_nID, name.c_str()), value); 
    }
    inline void setFloat(const std::string &name, float value) const
    { 
        glUniform1f(glGetUniformLocation(m_nID, name.c_str()), value); 
    }

    inline unsigned int getID() { return m_nID; }

private:
    unsigned int m_nID;

private:
    void checkCompileErrors(unsigned int shader, std::string type); 
};
#endif