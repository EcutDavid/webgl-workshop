/*
  * STEP 1
  * Access WebGL context
*/
const canvasDom = document.querySelector('canvas');
const gl = canvasDom.getContext('webgl');

const canvasWidth = canvasDom.clientWidth;
const canvasHeight = canvasDom.clientHeight;
// Set viewport when it comes to canvas resizing
// gl.viewport(0, 0, canvasWidth, canvasHeight)
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

let geometryPoints = [
  -15.0, -15.0,  15.0,
   15.0, -15.0,  15.0,
   15.0,  15.0,  15.0,
  -15.0,  15.0,  15.0,

  // Back face
  -15.0, -15.0, -15.0,
  -15.0,  15.0, -15.0,
   15.0,  15.0, -15.0,
   15.0, -15.0, -15.0,

  // Top face
  -15.0,  15.0, -15.0,
  -15.0,  15.0,  15.0,
   15.0,  15.0,  15.0,
   15.0,  15.0, -15.0,

  // Bottom face
  -15.0, -15.0, -15.0,
   15.0, -15.0, -15.0,
   15.0, -15.0,  15.0,
  -15.0, -15.0,  15.0,

  // Right face
   15.0, -15.0, -15.0,
   15.0,  15.0, -15.0,
   15.0,  15.0,  15.0,
   15.0, -15.0,  15.0,

  // Left face
  -15.0, -15.0, -15.0,
  -15.0, -15.0,  15.0,
  -15.0,  15.0,  15.0,
  -15.0,  15.0, -15.0
];

const textureCoords = [
  // Front face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Back face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  // Top face
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  // Bottom face
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  // Right face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  // Left face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
];

/*
  * STEP 2
  * Create shaders and link program
*/
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

// vec2 = a vector which length is 2
const vertexShaderSource = `
  // An attribute will receive data from a buffer
  attribute vec2 a_cord;
  attribute vec4 position;
  uniform vec4 resolution;
  varying vec2 v_color;
  varying vec4 v_pos;
  uniform mat4 transformMat;
  uniform mat4 cameraMat;

  void main() {
    vec4 transformedPosition = transformMat * cameraMat * position;
    vec4 glSpacePosition = (transformedPosition / resolution) * 2.0 - 1.0;

    float xyDivision = 1.0 + 0.5 * glSpacePosition.z;
    glSpacePosition = vec4(glSpacePosition.xy / xyDivision, glSpacePosition.z, 1);
    gl_Position = vec4(glSpacePosition.xyz * vec3(1, -1, 1), 1);
    v_pos = position / 60.0 + 0.5;
    v_color = a_cord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_color;
  varying vec4 v_pos;
  uniform sampler2D u_texture;
  uniform float lineIndicator;

  void main() {
    gl_FragColor = texture2D(u_texture, v_color.xy);
  }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
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
const program = createProgram(gl, vertexShader, fragmentShader);

/*
  * STEP 3
  * Configuration
*/
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
const cordAttributeLocation = gl.getAttribLocation(program, 'a_cord');
gl.enableVertexAttribArray(cordAttributeLocation);
const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');
const cameraMatUniformLocation = gl.getUniformLocation(program, 'cameraMat');

const positionBuffer = gl.createBuffer();
// In WebGL, we can manipulate many resources on global bind points.
// Treat bind points as internal global variables hooks inside WebGL.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const cordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cordBuffer);
gl.vertexAttribPointer(cordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cordBuffer), gl.STATIC_DRAW);
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
const lineIndicatorUniformLocation = gl.getUniformLocation(program, 'lineIndicator');
gl.uniform4f(resolutionUniformLocation, canvasWidth, canvasHeight, 1200, 1);

const texture = gl.createTexture();
texture.image = new Image();
texture.image.onload = function() {
  handleLoadedTexture(texture)
}
texture.image.src = "github.jpg";

function handleLoadedTexture(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  draw();
}

/*
  * STEP 4
  * Bind data and call drawArrays
*/
let angle = 0;
const cubeVertexIndices = [
  0, 1, 2,      0, 2, 3,    // Front face
  4, 5, 6,      4, 6, 7,    // Back face
  8, 9, 10,     8, 10, 11,  // Top face
  12, 13, 14,   12, 14, 15, // Bottom face
  16, 17, 18,   16, 18, 19, // Right face
  20, 21, 22,   20, 22, 23  // Left face
];
const cubeVertexIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, cordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryPoints), gl.STATIC_DRAW);
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

  const rotationMatrix = Matrix.yRotate(Matrix.zRotation(angle), angle);
  for (let i = 6; i < 420 / 35; i++) {
    for (let j = 6; j < 420 / 35; j++) {
      for (let k = 6; k < 420 / 35; k++) {
        gl.uniformMatrix4fv(transformMatUniformLocation, false,
            Matrix.translate(
              Matrix.multiply(Matrix.translation(0, 0, 0), rotationMatrix),
              0 + 40 * i, 0 +40 * j, 0 + 40 * k
            )
        );
        gl.uniformMatrix4fv(
          cameraMatUniformLocation,
          false,
          Matrix.multiply(Matrix.translation(0, 0, 0), Matrix.xRotation(angle))
        );

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      }
    }
  }
  angle += 0.048;
  requestAnimationFrame(draw);
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
