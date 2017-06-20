import React from 'react';

import 'styles/main.scss';

class AppComponent extends React.Component {
  componentDidMount() {
    const gl = document.querySelector('canvas').getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    const canvasWidth = 600;
    const canvasHeight = 600;
    const canvasDepth = 600;

    const vertexShaderSource = `
      attribute vec4 position;
      uniform mat4 transform;

      void main() {
        gl_Position = transform * position;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 color;

      void main() {
        gl_FragColor = color;
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

    class M4 {
      static projection(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
           2 / width, 0, 0, 0,
           0, -2 / height, 0, 0,
           0, 0, 2 / depth, 0,
          -1, 1, 0, 1,
        ];
      }

      static multiply(matrixA, matrixB) {
        const matrixALength = Math.sqrt(matrixA.length);
        const matrixBLength = Math.sqrt(matrixB.length);
        if(matrixALength !== matrixBLength) {
            throw new Error('Length matrices should be same');
        }
        const length = matrixALength;
        const result = [];
        for(let i = 0; i < length; i++) {
            for(let j = 0; j < length; j++) {
                let value = 0;
                for(let k = 0; k < length; k++) {
                     value += matrixB[i * length + k] * matrixA[k * length + j];
                }
                result[i * length + j] = value;
            }
        }
        return result;
      }

      static translation(tx, ty, tz) {
        return [
           1,  0,  0,  0,
           0,  1,  0,  0,
           0,  0,  1,  0,
           tx, ty, tz, 1,
        ];
      }

      static xRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ];
      }

      static yRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
          c, 0, -s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1,
        ];
      }

      static zRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [
           c, s, 0, 0,
          -s, c, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1,
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

      static translate(m, tx, ty, tz) {
        return M4.multiply(m, M4.translation(tx, ty, tz));
      }

      static xRotate(m, angleInRadians) {
        return M4.multiply(m, M4.xRotation(angleInRadians));
      }

      static yRotate(m, angleInRadians) {
        return M4.multiply(m, M4.yRotation(angleInRadians));
      }

      static zRotate(m, angleInRadians) {
        return M4.multiply(m, M4.zRotation(angleInRadians));
      }

      static scale(m, sx, sy, sz) {
        return M4.multiply(m, M4.scaling(sx, sy, sz));
      }
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
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const transformUniformLocation = gl.getUniformLocation(program, 'transform');
    let transformMatrix = M4.projection(canvasWidth, canvasHeight, canvasDepth);
    transformMatrix = M4.translate(transformMatrix, 240, 150, 0);
    gl.uniformMatrix4fv(transformUniformLocation, false, transformMatrix);
    const colorUniformLocation = gl.getUniformLocation(program, 'color');
    gl.uniform4fv(colorUniformLocation, [0.5, 0.5, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    function translateGeo(geo, tansX) {
      geo.forEach((d, i) => {
        if(i % 3 === 0) {
          geo[i] = d + tansX;
        }
      });
    }

    function draw() {
      const elePlaneGeo = [
        0, 100, 0,  100, 100, 0,  0, 100, 100,
        100, 100, 100,  100, 100, 0,  0, 100, 100,

        0, 100, 0,  50, 50, 50,  0, 100, 100,

        100, 100, 0,  50, 50, 50,  0, 100, 100,

        100, 100, 0,  50, 50, 50,  100, 100, 100,

        0, 100, 100,  50, 50, 50,  100, 100, 100,
      ];
      translateGeo(elePlaneGeo, 140);

      const eleLineGeo = [
        0, 100, 0,  100, 100, 0,
        0, 100, 0,  0, 100, 100,

        100, 100, 100,  0, 100, 100,
        100, 100, 100,  100, 100, 0,

        50, 50, 50,  0, 100, 100,
        50, 50, 50,  100, 100, 0,
        50, 50, 50,  0, 100, 0,
        50, 50, 50,  100, 100, 100
      ];
      translateGeo(eleLineGeo, 140);

      const cubePlaneGeo = [
        0, 0, 0,  100, 0, 0,  0, 0, 100,
        100, 0, 100,  100, 0, 0,  0, 0, 100,

        0, 100, 0,  100, 100, 0,  0, 100, 100,
        100, 100, 100,  100, 100, 0,  0, 100, 100,

        0, 0, 0,  0, 0, 100,  0, 100, 0,
        0, 100, 100,  0, 0, 100,  0, 100, 0,

        100, 0, 0,  100, 0, 100,  100, 100, 0,
        100, 100, 100,  100, 0, 100,  100, 100, 0,

        0, 0, 0,  100, 0, 0,  0, 100, 0,
        100, 100, 0,  100, 0, 0,  0, 100, 0,

        0, 0, 100,  100, 0, 100,  0, 100, 100,
        100, 100, 100,  100, 0, 100,  0, 100, 100,
      ];
      const cubeLineGeo = [
        0, 0, 0,  100, 0, 0,
        0, 0, 0,  0, 0, 100,
        100, 0, 100,  100, 0, 0,
        100, 0, 100,  0, 0, 100,

        0, 100, 0,  100, 100, 0,
        0, 100, 0,  0, 100, 100,
        100, 100, 100,  100, 100, 0,
        100, 100, 100,  0, 100, 100,

        0, 0, 0,  0, 100, 0,
        100, 0, 0,  100, 100, 0,
        0, 0, 100,  0, 100, 100,
        100, 0, 100,  100, 100, 100
      ];

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      gl.uniform4fv(colorUniformLocation, [1, 1, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(elePlaneGeo), gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, elePlaneGeo.length / 3);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePlaneGeo), gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, cubePlaneGeo.length / 3);

      gl.uniform4fv(colorUniformLocation, [0.5, 0.5, 0.5, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(eleLineGeo), gl.STATIC_DRAW);
      gl.drawArrays(gl.LINES, 0, eleLineGeo.length / 3);

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeLineGeo), gl.STATIC_DRAW);
      gl.drawArrays(gl.LINES, 0, cubeLineGeo.length / 3);
    }

    let counter = 0;
    setInterval(() => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        draw();
        transformMatrix = M4.yRotate(transformMatrix, Math.PI / 60);
        transformMatrix = M4.zRotate(transformMatrix, Math.PI / 60);
        transformMatrix = M4.xRotate(transformMatrix, Math.PI / 60);
        gl.uniformMatrix4fv(transformUniformLocation, false, transformMatrix);
    }, 50);
  }

  render() {
    return (
      <div className="index">
        <h1>WebGL workshop</h1>
        <p>Final version will be presented on June 26</p>
        <canvas width="600" height="600"></canvas>
        <p>David Guan</p>
        <p>davidguandev@gmail.com</p>
      </div>
    );
  }
}

export default AppComponent;
