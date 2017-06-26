import React from 'react';

import 'styles/header.scss';
import img from './github.jpg';
import { mat4 } from 'gl-matrix';
import Matrix from '../helpers/matrix';
import { createProgram, createShader } from '../helpers/webglUtil';
import {
  CUBE_LENGTH,
  CUBE_VERTEX_INDICES,
  GEOMETRY_POINTS,
  TEXTURE_CORDS
} from '../constants/headerGL';

export default class Header extends React.Component {
  componentDidMount() {
    const canvasDom = document.querySelector('canvas');
    let yAngle = 0;
    let xAngle = 0;

    document.addEventListener('click', (event) => {
      const x = event.clientX - canvasDom.getBoundingClientRect().left;
      const y = event.clientY - canvasDom.getBoundingClientRect().top;
      for (let i = 0; i < CUBE_ROW_COUNT; i++) {
        for (let j = 0; j < CUBE_COL_COUNT; j++) {
          const cube = cubes[i * CUBE_COL_COUNT + j];
          if (Math.abs(x - cube.x - cube.dx) < CUBE_LENGTH / 2
            && Math.abs(y - cube.y - cube.dy) < CUBE_LENGTH / 2) {
            cube.clicked = true;
          }
        }
      }
    });

    function resizeCanvas() {
      canvasDom.width = canvasDom.clientWidth;
      canvasDom.height = canvasDom.clientHeight;
    }
    window.onresize = resizeCanvas;
    resizeCanvas();

    document.addEventListener('mousemove', (event) => {
      const domBodyWidth = document.body.getBoundingClientRect().width;
      const domBodyHeight = 'innerHeight' in window
        ? window.innerHeight : document.documentElement.offsetHeight;
      let factor = (event.clientX / domBodyWidth - 0.5) * 2;
      yAngle = 10 * factor / 180 * Math.PI;
      if (event.clientY < domBodyHeight) {
        factor = (event.clientY / domBodyHeight - 0.5) * 2;
        xAngle = 10 * factor / 180 * Math.PI;
      }
      // console.log(`x: ${event.clientX}, y: ${event.clientY}`);
    }, false);
    const gl = canvasDom.getContext('webgl');

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = `
      // An attribute will receive data from a buffer
      attribute vec2 a_cord;
      attribute vec4 position;
      uniform vec4 resolution;
      varying vec2 v_cord;
      uniform mat4 modelTrans;
      uniform mat4 viewTrans;

      void main() {
        vec4 transformedPosition = viewTrans * modelTrans * position;
        vec4 glSpacePosition = (transformedPosition / resolution) * 2.0 - 1.0;

        float xyDivision = 1.0 - 0.2 * glSpacePosition.z;
        glSpacePosition = vec4(glSpacePosition.xy / xyDivision, glSpacePosition.z, 1);
        gl_Position = vec4(glSpacePosition.xyz * vec3(1, -1, 1), 1);
        v_cord = a_cord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_cord;
      uniform sampler2D u_texture;
      uniform float lineIndicator;

      void main() {
        vec3 light = normalize(vec3(0.6, 0.4, 1));
        float lightFac = dot(vec3(0, 0, -1), light);

        gl_FragColor = texture2D(u_texture, v_cord.xy);
        // gl_FragColor.rgb *= lightFac;
      }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);


    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    const cordAttributeLocation = gl.getAttribLocation(program, 'a_cord');
    gl.enableVertexAttribArray(cordAttributeLocation);
    const modelTransUniformLocation = gl.getUniformLocation(program, 'modelTrans');
    const viewTransUniformLocation = gl.getUniformLocation(program, 'viewTrans');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const cordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cordBuffer);
    gl.vertexAttribPointer(cordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cordBuffer), gl.STATIC_DRAW);
    const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

    const texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function() {
      handleLoadedTexture(texture);
    };
    // texture.image.crossOrigin = '';
    texture.image.src = img;

    function handleLoadedTexture(texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      // gl.bindTexture(gl.TEXTURE_2D, null);
      draw();
    }

    const cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(CUBE_VERTEX_INDICES), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TEXTURE_CORDS), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(GEOMETRY_POINTS), gl.STATIC_DRAW);

    let angle = 0;
    const cubes = [];
    const CUBE_ROW_COUNT = 4;
    const CUBE_COL_COUNT = 4;
    const CUBE_MARGIN = 40;
    for (let i = 0; i < CUBE_ROW_COUNT; i++) {
      for (let j = 0; j < CUBE_COL_COUNT; j++) {
        cubes.push({
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          z: 600,
          id: `i${i}j${j}`,
          clicked: false,
          xInc: Math.random() * 20 - 10,
          yInc: Math.random() * 20 - 10
        });
      }
    }

    function draw() {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform4f(resolutionUniformLocation, canvasDom.width, canvasDom.height, 1200, 1);

      gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

      let viewTransMatrix = Matrix.translation(0, 0, 0);
      // viewTransMatrix = Matrix.yRotate(viewTransMatrix, yAngle);
      // viewTransMatrix = Matrix.xRotate(viewTransMatrix, -xAngle);
      mat4.invert(viewTransMatrix, viewTransMatrix);
      gl.uniformMatrix4fv(viewTransUniformLocation, false, viewTransMatrix);

      for (let i = 0; i < CUBE_ROW_COUNT; i++) {
        for (let j = 0; j < CUBE_COL_COUNT; j++) {
          const cube = cubes[i * CUBE_COL_COUNT + j];
          if (cube.clicked) {
            cube.dx += cube.xInc;
            cube.dy += cube.yInc;
          }
          cube.x = canvasDom.width / 2 + (CUBE_LENGTH + CUBE_MARGIN) * (j + 0.5 - (CUBE_COL_COUNT / 2));
          cube.y = canvasDom.height / 2 + (CUBE_LENGTH + CUBE_MARGIN) * (i + 0.5 - (CUBE_ROW_COUNT / 2));
          let matrix = Matrix.zRotation(0);
          if (i == 0 && (j == 1 || j == 2)) {
            matrix = Matrix.yRotate(matrix, angle * 3);
            matrix = Matrix.xRotate(matrix, angle * 3);
          } else {
            matrix = Matrix.yRotate(matrix, -yAngle * 3);
            matrix = Matrix.xRotate(matrix, xAngle * 3);
          }
          matrix = Matrix.translate(matrix, cube.x + cube.dx, cube.y + cube.dy, cube.z);
          gl.uniformMatrix4fv(modelTransUniformLocation, false, matrix);
          gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
      }
      angle += 0.018;
      requestAnimationFrame(draw);
    }
  }

  render() {
    return (
      <div className='Header'>
        <h1>WebGL Workshop</h1>
        <canvas className='header-canvas'></canvas>
        <div className='cover'></div>
      </div>
    );
  }
}
