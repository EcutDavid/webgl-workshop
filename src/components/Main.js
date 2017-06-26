import React from 'react';

import 'styles/main.scss';
import CodeMirror from 'codemirror/lib/codemirror';
import Header from './Header';
import NavigationBar from './NavigationBar';
import {
  GET_STARTED,
  DRAW_TRIANGLES,
  GET_CANVAS_ES6,
  GL_CONFIGURATION_ES6,
  ADD_RESOLUTION,
  CONFIG_RESOLUTION_UNIFORM,
  SET_UNIFORM_RESOLUTION,
} from '../constants/code';
import babelImg from '../images/babel.png';
import resolutionUniformImg from '../images/resolutionUniform.png';
import shadersImg from '../images/shaders.png';
import axisImg from '../images/axis.png';
import DiffMatchPatch from 'diff-match-patch';
import drawTriangles from '../steps/drawTriangles';

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
  componentDidMount() {
    const codeBlocks = document.querySelectorAll('.workshop-content .codeblock');
    for (let i = 0; i < codeBlocks.length; i++) {
      const block = codeBlocks[i];
      const textContent = block.textContent;
      block.textContent = '';
      loadCode(textContent, block);
    }

    drawTriangles('#trianglesDemo');
  }

  render() {
    return (
      <div>
        <div className='workshop-content'>
          <p>The javascript code on this website is using es2015 syntax, which is well supported by most of the browsers.</p>
          <p>You can use <a href='https://babeljs.io/repl/'>babeljs.io/repl</a> to transform the code to javascript engine friendlier.</p>
          <img src={babelImg}></img>
          <p>In real-life projects we will integrate the code transformation into building process for sure.</p>
          <h2 id='sec1'>Step 1: Draw 2D Triangles</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='trianglesDemo'></canvas>
          <h3>WebGL context</h3>
          <p>Let's get started with HTML, to keep this workshop simple, we will put all code in a single file, <b>please do not follow this practice in real-life projects</b>.</p>
          <div className='codeblock'>{GET_STARTED}</div>
          <p>From now on, we will just work in the script tag</p>
          <p>Get the WebGL context from canvas.</p>
          <div className='codeblock' id='getCanvas'>{GET_CANVAS_ES6}</div>
          <h3>Configuration</h3>
          <p>We need compile the shaders, link the program and configure data pipeline between main memory and GPU's memory.</p>
          <div className='codeblock' id='glConfig'>{GL_CONFIGURATION_ES6}</div>
          <h3>Draw Triangles</h3>
          <div className='codeblock' id='drawTriangles'>{DRAW_TRIANGLES}</div>
          <h2 id='sec2'>Step 2: Understand Shaders</h2>
          <img src={shadersImg}></img>
          <p>To pass data to shaders, we can use <b>attribute</b>, <b>varying</b>, <b>uniform</b> and <b>texture</b>.</p>
          <h3>Uniforms</h3>
          <p>In the previous example, the points is mapped to WebGL's space, we can map the space to a one that we are normally using.</p>
          <img src={axisImg}></img>
          <p>For x-axis, (-1, 1) -> (0, drawing buffer width)</p>
          <p>For y-axis, (-1, 1) -> (drawing buffer height, 0)</p>
          <p>For z-axis, (-1, 1) -> (0, drawing buffer depth)</p>
          <p>And let's do it with uniform.</p>
          <div className='codeblock' id='code'>{ADD_RESOLUTION}</div>
          <p>Same as configure data buffer for attribute, we need configure the uniform with javascript.</p>
          <div className='codeblock' id='code'>{CONFIG_RESOLUTION_UNIFORM}</div>
          <p>Now let's modify the data buffer for the triangles.</p>
          <div className='codeblock' id='code'>{SET_UNIFORM_RESOLUTION}</div>
          <img src={resolutionUniformImg}></img>
          <p><b>Practice: draw more than one triangles and control the color using uniform instead of varying.</b></p>
          <h2 id='sec3'>Step 3: Play with Animations</h2>
          <h3>Final result</h3>
          <div className='codeblock' id='code'></div>
          <h2 id='sec4'>Step 4: Transform 3D cube</h2>
          <h2 id='sec5'>Step 5: Implement User Interactions</h2>
          <h2 id='sec6'>What's Next?</h2>
        </div>
        <NavigationBar />
        <div className='footer' />
      </div>
    );
  }
}

export default Main;
