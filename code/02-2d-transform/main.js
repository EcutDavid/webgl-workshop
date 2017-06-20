// Lots of code below comes from https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html with my personal thoughts
const gl = document.querySelector('canvas').getContext('webgl');

const canvasWidthHeight = 600;
// Setting viewport is not needed here,
// But remember setting viewport when it comes to canvas resizing.
// gl.viewport(0, 0, canvasWidthHeight, canvasWidthHeight);
gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShaderSource = `
  // An attribute will receive data from a buffer
  attribute vec2 position;
  uniform vec2 resolution;
  uniform mat3 transformMat;
  varying vec4 v_color;

  // All shaders have a main function
  void main() {
    vec2 transformedPosition = (transformMat * vec3(position, 1)).xy;
    vec2 glSpacePosition = (transformedPosition / resolution) * 2.0 - 1.0;

    // gl_position is a special variable a vertex shader is responsible for setting
    gl_Position = vec4(glSpacePosition * vec2(1, -1), 0, 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 color;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;

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

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(!success) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  return program;
}

const program = createProgram(gl, vertexShader, fragmentShader);

// We created a program on GPU, so the next step is supplying data.
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
const colorUniformLocation = gl.getUniformLocation(program, 'color');
const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');

const positionBuffer = gl.createBuffer();
// In WebGL, we can manipulate many resources on global bind points.
// Treat bind points as internal global variables hooks inside WebGL.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.useProgram(program);
gl.uniform2f(resolutionUniformLocation, canvasWidthHeight, canvasWidthHeight);
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), Math.random());

gl.enableVertexAttribArray(positionAttributeLocation);

// gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
// This method bind ARRAY_BUFFER to specified attribute
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
let counter = 0;
function drawRandomizedTriangles() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  const trianglePointList = [];

  trianglePointList.push(0);
  trianglePointList.push(0);
  trianglePointList.push(20);
  trianglePointList.push(0);
  trianglePointList.push(0);
  trianglePointList.push(100);

  trianglePointList.push(20);
  trianglePointList.push(100);
  trianglePointList.push(20);
  trianglePointList.push(0);
  trianglePointList.push(0);
  trianglePointList.push(100);

  trianglePointList.push(20);
  trianglePointList.push(100);
  trianglePointList.push(20);
  trianglePointList.push(80);
  trianglePointList.push(60);
  trianglePointList.push(100);

  trianglePointList.push(60);
  trianglePointList.push(80);
  trianglePointList.push(20);
  trianglePointList.push(80);
  trianglePointList.push(60);
  trianglePointList.push(100);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglePointList), gl.STATIC_DRAW);

  gl.uniformMatrix3fv(transformMatUniformLocation, false, Matrix.translation(100, 0));
  gl.drawArrays(gl.TRIANGLES, 0, trianglePointList.length/2);

  gl.uniformMatrix3fv(transformMatUniformLocation, false, Matrix.multiply(Matrix.rotation(0.005 * counter), Matrix.translation(100, 210)));
  gl.drawArrays(gl.TRIANGLES, 0, trianglePointList.length/2);

  gl.uniformMatrix3fv(transformMatUniformLocation, false, Matrix.multiply(Matrix.scaling(0.005 * counter % 1, 0.005 * counter), Matrix.translation(100, 350)));
  gl.drawArrays(gl.TRIANGLES, 0, trianglePointList.length/2);

  requestAnimationFrame(drawRandomizedTriangles);
  counter ++;
}
requestAnimationFrame(drawRandomizedTriangles);

class Matrix {
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

  static scaling(sx, sy){
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
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
}
