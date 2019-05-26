
attribute vec4 vertex;

uniform mat4 perViewModel;

void main(void)
{
    gl_Position = perViewModel * vertex;
}
