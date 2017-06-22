const canvasDom = document.querySelector('canvas');
const gl = canvasDom.getContext('webgl');

const canvasWidth = canvasDom.clientWidth;
const canvasHeight = canvasDom.clientHeight;
const canvasDepth = 600;
// Set viewport when it comes to canvas resizing
// gl.viewport(0, 0, canvasWidth, canvasHeight)
gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShaderSource = `
  // An attribute will receive data from a buffer
  attribute vec3 position;
  uniform vec3 resolution;
  uniform mat4 transformMat;
  varying vec4 v_color;
  uniform float perspectiveFactor;

  // All shaders have a main function
  void main() {
    vec3 transformedPosition = (transformMat * vec4(position, 1)).xyz;
    vec3 glSpacePosition = (transformedPosition / resolution) * 2.0 - 1.0;

    float xyDivision = 1.0 - perspectiveFactor * glSpacePosition.z;
    glSpacePosition = vec3(glSpacePosition.xy / xyDivision, glSpacePosition.z);
    gl_Position = vec4(glSpacePosition * vec3(1, -1, 1), 1);
    v_color = gl_Position * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 color;
  uniform float isLine;
  varying vec4 v_color;

  void main() {
    if(isLine > 0.0) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = v_color;
    }
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
const isLineUniformLocation = gl.getUniformLocation(program, 'isLine');
const perspectiveFactorUniformLocation = gl.getUniformLocation(program, 'perspectiveFactor');

const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');

const positionBuffer = gl.createBuffer();
// In WebGL, we can manipulate many resources on global bind points.
// Treat bind points as internal global variables hooks inside WebGL.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
gl.uniform3f(resolutionUniformLocation, canvasWidth, canvasHeight, canvasDepth);
gl.uniform1f(isLineUniformLocation, 0);
gl.uniform1f(perspectiveFactorUniformLocation, 0.9);
gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), Math.random());

gl.enableVertexAttribArray(positionAttributeLocation);

// gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
// This method bind ARRAY_BUFFER to specified attribute
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
let counter = 0;
function drawRandomizedTriangles() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  const axesPointList = [
    50, 300, 300,
    550, 300, 300,
    300, 50, 300,
    300, 550, 300,
    300, 300, 50,
    300, 300, 550,
  ];

  const rotationMatrix = Matrix.yRotate(Matrix.zRotation(0.005 * counter), 0.005 * counter);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axesPointList), gl.STATIC_DRAW);
  gl.uniformMatrix4fv(transformMatUniformLocation, false, Matrix.identity());
  gl.drawArrays(gl.LINES, 0, axesPointList.length / 3);

  drawPolyhedron(0, 0, -300);
  drawPolyhedron(200, 0, -200);
  drawPolyhedron(200, 200, -100);
  drawPolyhedron(0, 200, 0);
  requestAnimationFrame(drawRandomizedTriangles);
  counter ++;
}
requestAnimationFrame(drawRandomizedTriangles);

function drawPolyhedron(x, y, z) {
  const rotationMatrix = Matrix.xRotate(Matrix.zRotation(0.015 * counter), 0.015 * counter);
  gl.uniformMatrix4fv(transformMatUniformLocation, false,
      Matrix.translate(
        Matrix.multiply(Matrix.translation(-200, -200, -400), rotationMatrix),
        200 + x, 200 + y, 400 + z
      )
  );
  let geometryPoints = [
    170, 200, 370,
    230, 200, 370,
    200, 275, 400,
    170, 200, 370,
    230, 200, 370,
    200, 125, 400,

    170, 200, 370,
    170, 200, 430,
    200, 275, 400,
    170, 200, 370,
    170, 200, 430,
    200, 125, 400,

    230, 200, 430,
    230, 200, 370,
    200, 275, 400,
    230, 200, 430,
    230, 200, 370,
    200, 125, 400,

    230, 200, 430,
    170, 200, 430,
    200, 275, 400,
    230, 200, 430,
    170, 200, 430,
    200, 125, 400
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryPoints), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, geometryPoints.length / 3);

  geometryPoints = [
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
    200, 125, 400,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryPoints), gl.STATIC_DRAW);
  gl.uniform1f(isLineUniformLocation, 1);
  gl.drawArrays(gl.LINES, 0, geometryPoints.length / 3);
  gl.uniform1f(isLineUniformLocation, 0);
}

class Matrix {
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
    return Matrix.multiply(m, Matrix.translation(tx, ty, tz));
  }

  static xRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.xRotation(angleInRadians));
  }

  static yRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.yRotation(angleInRadians));
  }

  static zRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.zRotation(angleInRadians));
  }

  static scale(m, sx, sy, sz) {
    return Matrix.multiply(m, Matrix.scaling(sx, sy, sz));
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
