import { initWebGL } from '../helpers/canvas';
import { createProgram, createShader } from '../helpers/webglUtil';

export default function(selector) {
  const gl = initWebGL(selector);
  const vertexShaderSrc = `
  attribute vec3 position;
  varying vec4 v_color;
  uniform vec3 resolution;
  uniform mat4 transformMat;

  void main() {
    vec4 transformedPosition =  transformMat * vec4(position, 1) / vec4(resolution, 1) * 2.0 - 1.0;
    gl_Position = transformedPosition * vec4(1, -1, 1, 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
`;
const fragmentShaderSrc = `
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
gl.uniform3f(resolutionUniformLocation, 500, 500, 500);

const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');

const pointList = [
  170, 200, 370,
  230, 200, 370,
  170, 200, 370,
  170, 200, 430,
  230, 200, 430,
  230, 200, 370,
  230, 200, 430,
  170, 200, 430,

  170, 200, 370,
  200, 275, 400,
  230, 200, 370,
  200, 275, 400,
  170, 200, 430,
  200, 275, 400,
  230, 200, 430,
  200, 275, 400,

  170, 200, 370,
  200, 125, 400,
  230, 200, 370,
  200, 125, 400,
  170, 200, 430,
  200, 125, 400,
  230, 200, 430,
  200, 125, 400
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);

let counter = 0;
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  let matrix = Matrix4By4.translation(-200, -200, -400);
  matrix = Matrix4By4.multiply(matrix, Matrix4By4.xRotation(counter / 100));
  matrix = Matrix4By4.multiply(matrix, Matrix4By4.scaling(2, 2, 1));
  matrix = Matrix4By4.multiply(matrix, Matrix4By4.yRotation(counter / 100));
  matrix = Matrix4By4.multiply(matrix, Matrix4By4.translation(200, 200, 400));
  gl.uniformMatrix4fv(transformMatUniformLocation, false, matrix);
  gl.drawArrays(gl.LINES, 0, pointList.length / 3);
  requestAnimationFrame(draw);
  counter++;
}
requestAnimationFrame(draw);
}
class Matrix4By4 {
  static identity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static xRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  }

  static yRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  }

  static zRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static scaling(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  }

  static translation(tx, ty, tz) {
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1
    ];
  }

  static translate(m, tx, ty, tz) {
    return Matrix4By4.multiply(m, Matrix4By4.translation(tx, ty, tz));
  }

  static xRotate(m, angleInRadians) {
    return Matrix4By4.multiply(m, Matrix4By4.xRotation(angleInRadians));
  }

  static yRotate(m, angleInRadians) {
    return Matrix4By4.multiply(m, Matrix4By4.yRotation(angleInRadians));
  }

  static zRotate(m, angleInRadians) {
    return Matrix4By4.multiply(m, Matrix4By4.zRotation(angleInRadians));
  }

  static scale(m, sx, sy, sz) {
    return Matrix4By4.multiply(m, Matrix4By4.scaling(sx, sy, sz));
  }

  static perspective(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  }

  static multiply(mat1, mat2) {
    const length = Math.sqrt(mat1.length);
    const result = [];
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        let value = 0;
        for (let k = 0; k < length; k++) {
          value += mat1[i * length + k] * mat2[k * length + j];
        }
        result[i * length + j] = value;
      }
    }
    return result;
  }
}
