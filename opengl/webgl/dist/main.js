!function(e){var n={};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=0)}([function(e,n,o){"use strict";o.r(n);function t(e,n,o){const t=r(e,e.VERTEX_SHADER,n),l=r(e,e.FRAGMENT_SHADER,o),c=e.createProgram();return e.attachShader(c,t),e.attachShader(c,l),e.linkProgram(c),e.getProgramParameter(c,e.LINK_STATUS)?c:(console.log("project compiled : "+e.getProgramInfoLog(c)),null)}function r(e,n,o){const t=e.createShader(n);return console.log(t),console.log(o),e.shaderSource(t,o),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(console.log("shader compiled : "+e.getShaderInfoLog(t)),e.deleteShader(t),null)}var l=[];!function(){for(var e in function(){for(var e=document.getElementById("gl_body").getElementsByTagName("canvas"),n=0;n<e.length;n++)if(l[n]=e[n].getContext("webgl"),null===l[n])return void console.log("The context ["+n+"] for gl is null instance.")}(),l){if(null===l[e])return void console.log("The context ["+e+"] for gl is null instance.");t(l[e],"\nattribute vec3 vPosition;\n\nuniform mat4 mModelView;\nuniform mat4 mProject;\n\nvec4 clip(vec4 vec)\n{\n    return mProject * mModelView * vec; \n}\n\nvoid main()\n{\n    gl_Position = clip(vec4(vPosition, 1.0));\n}\n","\nvoid main()\n{\n    gl_FragColor = vec4(1.0 ,1.0, 1.0, 1.0);\n}\n")}!function(){for(var e in l){if(null===l[e])return void console.log("The context ["+e+"] for gl is null instance.");l[e].clearColor(0,0,0,1),l[e].clear(l[e].COLOR_BUFFER_BIT)}}()}()}]);