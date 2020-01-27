// import _ from 'lodash';
import vert_shader from "./renderers/shaders/default_vert.glsl";
import frag_shader from "./renderers/shaders/default_frag.glsl";

import { load_shader, init_shader } from "./renderers/common/shaders";

var gl;
const canvas = "gl_canvas";

function init_context(canvas) {
    
    var can_ele = document.getElementById(canvas);

    gl = can_ele.getContext("webgl");
    if(gl === null)
    {
        console.log("gl is null instance.");
        return;
    }

}

function init_view() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);   

}

init_context(canvas);
init_shader(gl, vert_shader, frag_shader);
init_view();