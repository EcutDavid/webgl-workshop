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
gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

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
  attribute vec2 a_color;
  attribute vec2 position;
  uniform vec2 resolution;
  varying vec4 v_color;
  varying vec4 v_test;

  void main() {
    vec2 glSpacePosition = (position / resolution) * 2.0 - 1.0;

    gl_Position = vec4(glSpacePosition * vec2(1, -1), 0, 1);
    v_color = gl_Position * 0.5 + 0.5 * cos(0.0);
    v_test = vec4(a_color, 1, 1);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_color;
  varying vec4 v_test;
  uniform sampler2D u_texture;

  void main() {
    // gl_FragColor = vec4(0,0,0,1);
    // gl_FragColor = vec4(v_color.xy, 1,1);
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
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(colorAttributeLocation);

const positionBuffer = gl.createBuffer();
// In WebGL, we can manipulate many resources on global bind points.
// Treat bind points as internal global variables hooks inside WebGL.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0, 0,
  1, 0,
  0, 1,
  0, 1,
  0, 1,
  0, 1,
]), gl.STATIC_DRAW);
const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
gl.uniform2f(resolutionUniformLocation, canvasWidth, canvasHeight);

const texture = gl.createTexture();
texture.image = new Image();
texture.image.onload = function() {
  handleLoadedTexture(texture)
}
texture.image.src = "github.jpg";

function handleLoadedTexture(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  const pointList = [];

  pointList.push(0);
  pointList.push(0);
  pointList.push(canvasWidth);
  pointList.push(0);
  pointList.push(0);
  pointList.push(canvasHeight);

  pointList.push(canvasWidth);
  pointList.push(canvasHeight);
  pointList.push(canvasWidth);
  pointList.push(0);
  pointList.push(0);
  pointList.push(canvasHeight);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
  // angle += 0.005;
  requestAnimationFrame(draw);
}
// requestAnimationFrame(draw);
