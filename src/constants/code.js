export const GET_STARTED =
`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>WebGL Workshop</title>
  <style>
    canvas {
      display: block;
      margin: 50px auto;
    }
  </style>
</head>
<body>
  <canvas width="500" height="500"></canvas>
  <script>
  </script>
</body>
</html>`;

export const GET_CANVAS_ES5 =
`function initWebGL(selector) {
  var canvasDom = document.querySelector(selector);
  var gl = canvasDom.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, canvasDom.width, canvasDom.height);
  return gl;
}

var gl = initWebGL('canvas');
`;

export const GET_CANVAS_ES6 =
`function initWebGL(selector) {
  const canvasDom = document.querySelector(selector);
  const gl = canvasDom.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, canvasDom.width, canvasDom.height);
  return gl;
}

const gl = initWebGL('canvas');
`;

export const GL_CONFIGURATION_ES5 = '';
export const GL_CONFIGURATION_ES6 =
`function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(!success) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  return program;
}

function createShader(gl, type, shaderSource) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!success) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  return shader;
}

const vertexShaderSrc = \`
  attribute vec2 position;
  varying vec4 v_color;

  void main() {
    gl_Position = vec4(position, 0, 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;
const fragmentShaderSrc = \`
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
\`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
`;

export const DRAW_TRIANGLES =
`const pointList = [
  -1  ,  0,
  1   ,  0,
  0   ,  1,
  -1  , -1,
  0   , -1,
  -0.5,  0,
  1   , -1,
  0   , -1,
  0.5 ,  0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);

function draw() {
  gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
}
draw();`;

export const ADD_RESOLUTION =
`const vertexShaderSrc = \`
  attribute vec2 position;
  varying vec4 v_color;
+++  uniform vec3 resolution;

  void main() {
+++    vec3 transformedPosition = vec3(position, 0) / resolution * 2.0 - 1.0;
---    gl_Position = vec4(position, 0, 1);
+++    gl_Position = vec4(transformedPosition * vec3(1, -1, 1), 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;`;

export const CONFIG_RESOLUTION_UNIFORM =
`const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

+++  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
+++  gl.uniform3f(resolutionUniformLocation, 500, 500, 500);
`;

export const SET_UNIFORM_RESOLUTION =
`const pointList = [
---  -1  ,  0,
---  1   ,  0,
---  0   ,  1,
---  -1  , -1,
---  0   , -1,
---  -0.5,  0,
---  1   , -1,
---  0   , -1,
---  0.5 ,  0
+++  0, 0,
+++  250, 0,
+++  125, 250,
];`;

export const ADD_TRANSLATION =
`const vertexShaderSrc = \`
  attribute vec2 position;
  varying vec4 v_color;
  uniform vec3 resolution;
+++  uniform vec2 translation;

  void main() {
---    vec3 transformedPosition = vec3(position, 0) / resolution * 2.0 - 1.0;
+++    vec3 transformedPosition = vec3(position + translation, 0) / resolution * 2.0 - 1.0;
    gl_Position = vec4(transformedPosition * vec3(1, -1, 1), 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;

...

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
gl.uniform3f(resolutionUniformLocation, 500, 500, 500);

+++ const translationUniformLocation = gl.getUniformLocation(program, 'translation');
`;

export const TRANSLATE_TRIANGLE =
`+++let counter = 0;
function draw() {
+++  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
+++  gl.uniform2f(translationUniformLocation, counter % 400, 0);
  gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
+++  requestAnimationFrame(draw);
+++  counter++;
}
---draw();
+++requestAnimationFrame(draw);`;

export const ROTATING_SCALING_TRIANGLE =
`const vertexShaderSrc = \`
  attribute vec2 position;
  varying vec4 v_color;
  uniform vec3 resolution;
  uniform vec2 translation;
+++  uniform vec2 scaling;
+++  uniform float angle;

  void main() {
+++    float newX = (cos(angle) * position.x - sin(angle) * position.y) * scaling.x;
+++    float newY = (sin(angle) * position.x + cos(angle) * position.y) * scaling.y;
---    vec3 transformedPosition = vec3(position + translation, 0) / resolution * 2.0 - 1.0;
+++    vec3 transformedPosition = vec3(vec2(newX, newY) + translation, 0) / resolution * 2.0 - 1.0;
    gl_Position = vec4(transformedPosition * vec3(1, -1, 1), 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;`;

export const MATRIX_3BY3 =
`class Matrix3By3 {
  static identity() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }

  static rotation(angle) {
    return [
      Math.cos(angle), -Math.sin(angle), 0,
      Math.sin(angle), Math.cos(angle), 0,
      0, 0, 1
    ];
  }

  static scaling(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ];
  }

  static translation(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
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
}`;

export const APPLYING_MATRIX_3BY3 =
`const vertexShaderSrc = \`
  attribute vec2 position;
  varying vec4 v_color;
  uniform vec3 resolution;
---  uniform vec2 translation;
---  uniform vec2 scaling;
---  uniform float angle;
+++  uniform mat3 transformMat;

  void main() {
---    float newX = (cos(angle) * position.x - sin(angle) * position.y) * scaling.x;
---    float newY = (sin(angle) * position.x + cos(angle) * position.y) * scaling.y;
---    vec3 transformedPosition = vec3(vec2(newX, newY) + translation, 0) / resolution * 2.0 - 1.0;
+++    vec3 transformedPosition =  transformMat * vec3(position, 1) / resolution * 2.0 - 1.0;
    gl_Position = vec4(transformedPosition * vec3(1, -1, 1), 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;

...

---const translationUniformLocation = gl.getUniformLocation(program, 'translation');
---const angleUniformLocation = gl.getUniformLocation(program, 'angle');
---const scalingUniformLocation = gl.getUniformLocation(program, 'scaling');
+++const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');


let counter = 0;
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  let matrix = Matrix3By3.rotation(counter / 100);
  matrix = Matrix3By3.multiply(matrix, Matrix3By3.scaling(1, 1));
  matrix = Matrix3By3.multiply(matrix, Matrix3By3.translation(0, 0));
  gl.uniformMatrix3fv(transformMatUniformLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
  requestAnimationFrame(draw);
  counter++;
}
requestAnimationFrame(draw);
`;

export const CONFIG_3D =
`const vertexShaderSrc = \`
---  attribute vec2 position;
+++  attribute vec3 position;
  varying vec4 v_color;
  uniform vec3 resolution;
---  uniform mat3 transformMat;
+++  uniform mat4 transformMat;

  void main() {
---    vec3 transformedPosition =  transformMat * vec3(position, 1) / resolution * 2.0 - 1.0;
+++    vec4 transformedPosition =  transformMat * vec4(position, 1) / vec4(resolution, 1) * 2.0 - 1.0;
---    gl_Position = vec4(transformedPosition * vec3(1, -1, 1), 1);
+++    gl_Position = transformedPosition * vec4(1, -1, 1, 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;

...

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
---gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
+++gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
`;

export const MATRIX_4BY4 =
`class Matrix4By4 {
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
      0, 0, 0, 1
    ];
  }

  static yRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
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
      0,  0,  0,  1
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
`;

export const DRAW_3D =
`const pointList = [
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
requestAnimationFrame(draw);`;

export const USER_INTERACTION =
`document.addEventListener('click', event => {
  // You can get mouse position by event.clientX and event.clientY
});
document.addEventListener('mousemove', event => {
  // You can get mouse position by event.clientX and event.clientY
});`;
