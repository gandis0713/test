// import _ from 'lodash';
import vert_shader from "./renderers/shaders/default_vert.glsl";
import frag_shader from "./renderers/shaders/default_frag.glsl";

import { load_shader, init_shader } from "./renderers/common/shaders";

var gl_context = [];
const id_body = "gl_body";

function init_context() {
    
    var body_ele = document.getElementById(id_body);
    var canvases_ele = body_ele.getElementsByTagName("canvas");

    for(var index = 0; index < canvases_ele.length; index++)
    {
        gl_context[index] = canvases_ele[index].getContext("webgl");
        if(gl_context[index] === null)
        {
            console.log("The context [" + index + "] for gl is null instance.");
            return;
        }
    }
}

function init_view()
{
    for(var index in gl_context)
    {
        if(gl_context[index] === null)
        {
            console.log("The context [" + index + "] for gl is null instance.");
            return;
        }

        gl_context[index].clearColor(0.0, 0.0, 0.0, 1.0);
        gl_context[index].clear(gl_context[index].COLOR_BUFFER_BIT);   
    }
}

function initialize()
{
    init_context();

    for(var index in gl_context)
    {        
        if(gl_context[index] === null)
        {
            console.log("The context [" + index + "] for gl is null instance.");
            return;
        }

        init_shader(gl_context[index], vert_shader, frag_shader);
    }

    init_view();
}

initialize();
