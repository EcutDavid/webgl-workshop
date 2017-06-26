import { initWebGL } from '../helpers/canvas';
import { createProgram, createShader } from '../helpers/webglUtil';

export default function(selector) {
  const gl = initWebGL(selector);
  const triangleVertextShader = `
    attribute vec2 position;
    varying vec4 v_color;

    void main() {
      gl_Position = vec4(position, 0, 1);
      v_color = gl_Position * 0.5 + 0.5;
    }
  `;
  const triangleFragmentShader = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `;

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, triangleVertextShader);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, triangleFragmentShader);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  const pointList = [
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
  draw();
}
