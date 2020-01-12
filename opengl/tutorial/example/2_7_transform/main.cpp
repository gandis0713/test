#include "glad/glad.h"
#include <GLFW/glfw3.h>
#include <iostream>
#include "shader.h"
// #include "math/vector3.h"
// #include "math/vector4.h"
#include "math/matrix3.h"
#include "math/matrix4.h"
#include "math/math_funcs.h"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

void framebuffer_size_callback(GLFWwindow *window, int width, int height)
{
    glViewport(0, 0, width, height);
}

void processInput(GLFWwindow *window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }
}

int main()
{    
    Matrix3 mat3;

    for(int i = 0; i < 3; i++)
    {
        std::cout << i << ", " << 0 << ", " << &mat3[i].x << std::endl;
        std::cout << i << ", " << 1 << ", " << &mat3[i].y << std::endl;
        std::cout << i << ", " << 2 << ", " << &mat3[i].z << std::endl;
        std::cout << std::endl;
    }

    Matrix4 mat4;

    for(int i = 0; i < 4; i++)
    {
        std::cout << i << ", " << 0 << ", " << &mat4[i].x << std::endl;
        std::cout << i << ", " << 1 << ", " << &mat4[i].y << std::endl;
        std::cout << i << ", " << 2 << ", " << &mat4[i].z << std::endl;
        std::cout << i << ", " << 3 << ", " << &mat4[i].w << std::endl;
        std::cout << std::endl;
    }

    /*
    ** Initialize glfw
    */
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    GLFWwindow *window = glfwCreateWindow(800, 600, "example", NULL, NULL);
    if(window == NULL)
    {
        std::cout << "window instance is null" << std::endl;
        glfwTerminate();
        return -1;
    }

    glfwMakeContextCurrent(window);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    if(!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "failed to initialized glad" << std::endl;
        return -1;
    }

    /*
    ** create shader
    */

    Shader shader;
    shader.setShader("shaders/vertex.glsl", "shaders/fragment.glsl");

    float vertices[] = {
        // 위치              // 컬러             // 텍스처 좌표
        0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f,   // 우측 상단
        0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,   // 우측 하단
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f,   // 좌측 하단
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f    // 좌측 상단
    };

    // float vertices[] = {
    //      // 위치
    //      0.5f,  0.5f, 0.0f,
    //      0.5f, -0.5f, 0.0f,
    //     -0.5f, -0.5f, 0.0f,
    //     -0.5f,  0.5f, 0.0f
    // };

    unsigned int indices[] = {  
        0, 1, 3, // first triangle
        1, 2, 3  // second triangle
    };


    // float colors[] = {
    //     // 컬러
    //     1.0f, 0.0f, 0.0f,
    //     0.0f, 1.0f, 0.0f,
    //     0.0f, 0.0f, 1.0f,
    //     1.0f, 1.0f, 0.0f
    // };
    // float textures[] = {
    //     // 텍스처 좌표
    //     1.0f, 1.0f,   // 우측 상단
    //     1.0f, 0.0f,   // 우측 하단
    //     0.0f, 0.0f,   // 좌측 하단
    //     0.0f, 1.0f    // 좌측 상단
    // };

    // Generate vertex.
    unsigned int nVBO, nCBO, nEBO, nVAO;
    glGenVertexArrays(1, &nVAO);
    glGenBuffers(1, &nVBO);
    glGenBuffers(1, &nCBO);
    glGenBuffers(1, &nEBO);

    // Set up vertex data

    // Bind vertex data.
    glBindVertexArray(nVAO);
    
    glBindBuffer(GL_ARRAY_BUFFER, nVBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, nEBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1);

    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(6 * sizeof(float)));
    glEnableVertexAttribArray(2);

    glBindBuffer(GL_ARRAY_BUFFER, 0);

    glBindVertexArray(0);

    unsigned int nTexture1;
    glGenTextures(1, &nTexture1);
    glBindTexture(GL_TEXTURE_2D, nTexture1);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    
    int width, height, nrChannels;
    stbi_set_flip_vertically_on_load(true);
    unsigned char *data = stbi_load("resource/2_6/1.jpg", &width, &height, &nrChannels, 0);
    if(data)
    {
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
        glGenerateMipmap(GL_TEXTURE_2D);
    }
    else
    {
        std::cout << "Failed to load texture image1." << std::endl;
    }
    stbi_image_free(data);

    unsigned int nTexture2;
    glGenTextures(1, &nTexture2);
    glBindTexture(GL_TEXTURE_2D, nTexture2);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    
    data = stbi_load("resource/2_6/2.png", &width, &height, &nrChannels, 0);
    if(data)
    {
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
        glGenerateMipmap(GL_TEXTURE_2D);
    }
    else
    {
        std::cout << "Failed to load texture image2." << std::endl;
    }
    stbi_image_free(data);

    shader.use();

    glUniform1i(glGetUniformLocation(shader.getID(), "texture1"), 0);

    shader.setInt("texture2", 1);

    while(!glfwWindowShouldClose(window))
    {
        processInput(window);

        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, nTexture1);
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, nTexture2);

        shader.use();

        glBindVertexArray(nVAO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glDeleteVertexArrays(1, &nVAO);
    glDeleteBuffers(1, &nVBO);

    glfwTerminate();

    return 0;
}