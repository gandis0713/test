var context_name = "webgl";
var gl_canvas_id = "gl_canvas";

function main()
{
    // View.render();
    const canvas = document.getElementById(gl_canvas_id);
    // Initialize the GL context
    const gl = canvas.getContext(context_name);

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;