const { vec3, vec4, mat4 } = require("gl-matrix");

console.log('yarn');

const position = [99, 99, 99, 99];
console.log("test : ", position);

const ortho = mat4.create();
mat4.ortho(ortho, -100, 100, -100, 100, -100, 100);
const lookat = mat4.create();
mat4.lookAt(lookat, [0, 0, 0], [0, 0, -1], [0, 1, 0]);
console.log("ortho : ", ortho);
console.log("lookat : ", lookat);
const xRotation = mat4.create();
mat4.fromXRotation(xRotation, Math.PI / 4);

const projection = mat4.create();
// mat4.multiply(lookat, xRotation, lookat);
mat4.multiply(projection, ortho, lookat);
console.log("projection : ", projection);

const clipedPosition = [0, 0, 0];
vec4.transformMat4(clipedPosition, position, projection);
console.log("clipedPosition : ", clipedPosition);