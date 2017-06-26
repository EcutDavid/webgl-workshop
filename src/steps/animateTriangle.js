import { initWebGL } from '../helpers/canvas';
import { createProgram, createShader } from '../helpers/webglUtil';

export default function(selector) {
  const gl = initWebGL(selector);
  const triangleVertextShader = `
    attribute vec2 position;
    varying vec4 v_color;
    uniform mat3 transformMat;

    void main() {
      vec2 transformedPosition = (transformMat * vec3(position, 1)).xy;
      gl_Position = vec4(transformedPosition, 0, 1);
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
  const transformMatUniformLocation = gl.getUniformLocation(program, 'transformMat');
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  const pointList = [
    -1, 1,
    0, 1,
    -0.5, 0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointList), gl.STATIC_DRAW);

  let counter = 0;
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let matrix = Matrix3by3.translation(0.5, 0);
    matrix = Matrix3by3.multiply(matrix, Matrix3by3.rotation(counter / 100));
    matrix = Matrix3by3.multiply(matrix, Matrix3by3.translation(0, -0));
    gl.uniformMatrix3fv(transformMatUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);
    requestAnimationFrame(draw);
    counter++;
  }
  requestAnimationFrame(draw);
}

class Matrix3by3 {
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
}
