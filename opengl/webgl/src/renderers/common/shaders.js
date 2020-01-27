
export function init_shader(gl, vert_source, frag_source)
{
    const vert_shader = load_shader(gl, gl.VERTEX_SHADER, vert_source);
    const frag_shader = load_shader(gl, gl.FRAGMENT_SHADER, frag_source);

    const shader_program = gl.createProgram();

    gl.attachShader(shader_program, vert_shader);
    gl.attachShader(shader_program, frag_shader);
    gl.linkProgram(shader_program);

    if(!gl.getProgramParameter(shader_program, gl.LINK_STATUS))
    {
        console.log("project compiled : " + gl.getProgramInfoLog(shader_program));
        return null;
    }

    return shader_program;
}

export function load_shader(gl, type, source)
{
    const shader = gl.createShader(type);
    console.log(shader);
    console.log(source);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log("shader compiled : " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}