import React from 'react';

import 'styles/main.scss';
import CodeMirror from 'codemirror/lib/codemirror';
import Header from './Header';
import NavigationBar from './NavigationBar';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/canvas';
import { createProgram, createShader } from '../helpers/webglUtil';

const getStarted =
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

function initWebGL(selector) {
  const canvasDom = document.querySelector(selector);
  const gl = canvasDom.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  canvasDom.width = CANVAS_WIDTH;
  canvasDom.height = CANVAS_HEIGHT;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  return gl;
}

function loadCode(code, selector, isJs = true) {
  return CodeMirror(document.querySelector(selector), {
    value: code,
    mode: isJs ? 'javascript' : 'htmlmixed',
    theme: 'mdn-like',
    readOnly: 'true'
  });
}

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      getCanvas: {
        isES6: true
      }
    };
  }

  componentDidMount() {
    const gl = initWebGL('#demo1');
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
    gl.drawArrays(gl.TRIANGLES, 0, pointList.length / 2);

    loadCode(getStarted, '#htmlSetup', false);

    const getCanvasES6 = `
    function initWebGL(selector) {
      const canvasDom = document.querySelector(selector);
      const gl = canvasDom.getContext('webgl');
      gl.clearColor(0, 0, 0, 1);
      canvasDom.width = CANVAS_WIDTH;
      canvasDom.height = CANVAS_HEIGHT;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return gl;
    }

    const gl = initWebGL('canvas');
    `;
    let mirror = loadCode(getCanvasES6, '#getCanvasES6');
    const getCanvasES5 = `
    function initWebGL(selector) {
      var canvasDom = document.querySelector(selector);
      var gl = canvasDom.getContext('webgl');
      gl.clearColor(0, 0, 0, 1);
      canvasDom.width = CANVAS_WIDTH;
      canvasDom.height = CANVAS_HEIGHT;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return gl;

      var gl = initWebGL('canvas');
    }`;
    this.setState({getCanvas: {...this.state.getCanvas, mirror, es6: getCanvasES6, es5: getCanvasES5}});
  }

  switchES6(key) {
    const {isES6, mirror, es6, es5} = this.state[key];
    mirror.setValue(isES6 ? es5 : es6);
    this.setState({
      [key]: {...this.state[key], isES6: !isES6}
    });
  }

  render() {
    const {
      getCanvas,
    } = this.state;
    return (
      <div>
        <Header />
        <div className='workshop-content'>
          <h2 id='sec1'>2D Triangles</h2>
          <h3>Final result of this section</h3>
          <canvas className='demo-canvas' id='demo1'></canvas>
          <h3>WebGL context</h3>
          <p>Let's get started with HTML, to keep this workshop simple, we will put all code in a single file, <b>please do not follow this practice in real-life project</b>,</p>
          <div className='codeblock' id='htmlSetup'></div>
          <p>From now on, we will just work in the script tag, use the "Switch to ES5" button if your browsers does not support, <b>in real-life, we will transform code to ES5 for sure.</b></p>
          <p>Get the WebGL context from canvas.</p>
          <button className='button' onClick={this.switchES6.bind(this, 'getCanvas')}>
            Switch to ES{getCanvas.isES6 ? '5' : '6'}
          </button>
          <div className='codeblock' id='getCanvasES6'></div>
          <h3>Configuration</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h2 id='sec2'>Shaders</h2>
          <h3>WebGL context</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Configuration</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <h2 id='sec3'>Animations</h2>
          <h3>WebGL context</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Configuration</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <h2 id='sec4'>3D Cube</h2>
          <h3>WebGL context</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Configuration</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <p>blablabla</p>
          <h2 id='sec5'>User Interaction</h2>
          <h2 id='sec6'>Next Step</h2>
        </div>
        <NavigationBar />
      </div>
    );
  }
}

export default Main;
