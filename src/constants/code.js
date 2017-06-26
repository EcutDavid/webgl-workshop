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

export const GL_CONFIGURATION_ES5 = `s`;
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

const triangleVertextShader = \`
  attribute vec2 position;
  varying vec4 v_color;

  void main() {
    gl_Position = vec4(position, 0, 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
\`;
const triangleFragmentShader = \`
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
\`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, triangleVertextShader);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, triangleFragmentShader);
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
  -1, 0,
  1, 0,
  0, 1,
  -1, -1,
  0, -1,
  -0.5, 0,
  1, -1,
  0, -1,
  0.5, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);

function draw() {
  gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
}
draw();`
