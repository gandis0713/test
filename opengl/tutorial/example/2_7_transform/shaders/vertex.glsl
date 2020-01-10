#version 330 core

layout (location = 0) in vec3 vertex;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoords;
  
out vec3 fragColor; 
out vec2 fragTexCoords;

// uniform mat4 transform;

void main()
{
    gl_Position = vec4(vertex, 1.0);
    // gl_Position = transform * vec4(vertex, 1.0);
    fragColor = color;
    fragTexCoords = texCoords;
}