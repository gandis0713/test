#version 330 core

out vec4 FragColor;  

in vec3 fragColor;
in vec2 fragTexCoords;

uniform sampler2D sampleTexture2D;
  
void main()
{
    FragColor = texture(sampleTexture2D, fragTexCoords);
}