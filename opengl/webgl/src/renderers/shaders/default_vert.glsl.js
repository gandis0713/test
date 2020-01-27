export default `
attribute vec3 vPosition;

uniform mat4 mModelView;
uniform mat4 mProject;

vec4 clip(vec4 vec)
{
    return mProject * mModelView * vec; 
}

void main()
{
    gl_Position = clip(vec4(vPosition, 1.0));
}
`;
