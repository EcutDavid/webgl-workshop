import React from 'react';

import 'styles/main.scss';
import CodeMirror from 'codemirror/lib/codemirror';
import Header from './Header';
import NavigationBar from './NavigationBar';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/canvas';
import {
  DRAW_TRIANGLES,
  GET_CANVAS_ES6,
  GL_CONFIGURATION_ES6
} from '../constants/code';
import { createProgram, createShader } from '../helpers/webglUtil';
import babelImg from '../images/babel.png';
import shadersImg from '../images/shaders.png';
import DiffMatchPatch from 'diff-match-patch';
const diff = new DiffMatchPatch();

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
  return CodeMirror(
    typeof selector === 'string' ? document.querySelector(selector) : selector, {
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
      getCanvas: { isES6: true },
      glConfig: { isES6: true }
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
    var codeBlocks = document.querySelectorAll('.workshop-content .codeblock');
    for (let i = 0; i < codeBlocks.length; i++) {
      const block = codeBlocks[i];
      const textContent = block.textContent;
      block.textContent = '';
      loadCode(textContent, block);
    }
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

    loadCode(getStarted, '#htmlSetup', false);

    let mirror = loadCode(GET_CANVAS_ES6, '#getCanvas');
    this.setState({getCanvas: {...this.state.getCanvas, mirror, es6: GET_CANVAS_ES6, es5: ''}});

    mirror = loadCode(GL_CONFIGURATION_ES6, '#glConfig');
    this.setState({glConfig: {...this.state.glConfig, mirror, es6: GL_CONFIGURATION_ES6, es5: ''}});

    mirror = loadCode(DRAW_TRIANGLES, '#drawTriangles');
    this.setState({glConfig: {...this.state.glConfig, mirror, es6: GL_CONFIGURATION_ES6, es5: ''}});
  }

  switchES6(key) {
    const {isES6, mirror, es6, es5} = this.state[key];
    mirror.setValue(isES6 ? es5 : es6);
    this.setState({
      [key]: {...this.state[key], isES6: !isES6}
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className='workshop-content'>
          <p>The javascript code on this website is using es2015 syntax, which is well supported by most of the browsers.</p>
          <p>You can use <a href='https://babeljs.io/repl/'>babeljs.io/repl</a> to transform the code to javascript engine friendlier.</p>
          <img src={babelImg}></img>
          <p>In real-life projects we will integrate the code transformation into building process for sure.</p>
          <h2 id='sec1'>Step 1: Draw 2D Triangles</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='demo1'></canvas>
          <h3>WebGL context</h3>
          <p>Let's get started with HTML, to keep this workshop simple, we will put all code in a single file, <b>please do not follow this practice in real-life projects</b>.</p>
          <div className='codeblock' id='htmlSetup'></div>
          <p>From now on, we will just work in the script tag</p>
          <p>Get the WebGL context from canvas.</p>
          <div className='codeblock' id='getCanvas'></div>
          <h3>Configuration</h3>
          <p>We need compile the shaders, link the program and configure data pipeline between main memory and GPU's memory.</p>
          <div className='codeblock' id='glConfig'></div>
          <h3>Draw Triangles</h3>
          <div className='codeblock' id='drawTriangles'></div>
          <h2 id='sec2'>Step 2: Understand Shaders</h2>
          <img src={shadersImg}></img>
          <h3>Uniforms</h3>
          <div className='codeblock' id='code'>{getStarted}</div>
          <h3>Attributes and buffers</h3>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <h2 id='sec3'>Animations</h2>
          <h3>WebGL context</h3>
          <div className='codeblock' id='code'></div>
          <h3>Configuration</h3>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <h2 id='sec4'>3D Cube</h2>
          <h3>WebGL context</h3>
          <div className='codeblock' id='code'></div>
          <h3>Configuration</h3>
          <div className='codeblock' id='code'></div>
          <h3>Draw Points</h3>
          <div dangerouslySetInnerHTML={{__html: test}}></div>
          <h2 id='sec5'>User Interaction</h2>
          <h2 id='sec6'>Next Step</h2>
        </div>
        <NavigationBar />
      </div>
    );
  }
}

const test =`
<span>&para;<br>function initWebGL(selector) {&para;<br>  </span><del style="background:#ffe6e6;">const</del><ins style="background:#e6ffe6;">var</ins><span> canvasDom = document.querySelector(selector);&para;<br>  </span><del style="background:#ffe6e6;">const</del><ins style="background:#e6ffe6;">var</ins><span> gl = canvasDom.getContext('webgl');&para;<br>  gl.clearColor(0, 0, 0, 1);&para;<br>  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);&para;<br>  gl.enable(gl.DEPTH_TEST);&para;<br>  gl.viewport(0, 0, canvasDom.width, canvasDom.height);&para;<br>  return gl;&para;<br>}&para;<br></span>
`.replace(/&para;/g, '\n');

export default Main;
