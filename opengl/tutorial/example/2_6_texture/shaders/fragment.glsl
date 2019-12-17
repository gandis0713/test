#version 330 core

out vec4 FragColor;  

in vec3 fragColor;
in vec2 fragTexCoords;

uniform sampler2D texture1;
uniform sampler2D texture2;
  
void main()
{
    FragColor = mix(texture(texture1, fragTexCoords), texture(texture2, fragTexCoords), 0.2);
}