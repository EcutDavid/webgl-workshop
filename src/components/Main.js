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
  ADD_TRANSLATION,
  TRANSLATE_TRIANGLE,
  ROTATING_SCALING_TRIANGLE,
  MATRIX_3BY3,
  APPLYING_MATRIX_3BY3,
} from '../constants/code';
import babelImg from '../images/babel.png';
import resolutionUniformImg from '../images/resolutionUniform.png';
import shadersImg from '../images/shaders.png';
import axisImg from '../images/axis.png';
import DiffMatchPatch from 'diff-match-patch';
import drawTriangles from '../steps/drawTriangles';
import animateTriangle from '../steps/animateTriangle';
import animate3DShape from '../steps/animate3DShape';

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
    animateTriangle('#animateTriangleDemo', 0.5, 0);
    animateTriangle('#animateTriangleQuestion', 0.5, 0, -1, 1);
    // TODO: 3D cube
    animate3DShape('#transform3DShape');
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
          <p>To pass data to shaders, we can use <b>attribute</b>, <b>varying</b>, <b>uniform</b> and <b>texture</b>. View <a href='https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html' target='_blank'>this page</a> if you want to know more about them.</p>
          <h3>Uniforms</h3>
          <p>In the previous example, the points is mapped to WebGL's space, we can map the space to the one that we are normally using.</p>
          <img src={axisImg}></img>
          <div>
            <p>x-axis: (-1, 1) -> (0, drawing buffer width)</p>
            <p>y-axis: (-1, 1) -> (drawing buffer height, 0)</p>
            <p>z-axis: (-1, 1) -> (0, drawing buffer depth)</p>
          </div>
          <p>Let's do it with uniform.</p>
          <div className='codeblock'>{ADD_RESOLUTION}</div>
          <p>Same as configure data buffer for attribute, we need configure the uniform with javascript.</p>
          <div className='codeblock'>{CONFIG_RESOLUTION_UNIFORM}</div>
          <p>Now let's modify the data buffer for the triangles.</p>
          <div className='codeblock'>{SET_UNIFORM_RESOLUTION}</div>
          <img src={resolutionUniformImg}></img>
          <p><b>Practice: draw more than one triangles and control the color using uniform instead of varying.</b></p>
          <h2 id='sec3'>Step 3: Play with Animations</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='animateTriangleDemo'></canvas>
          <h3>Translation</h3>
          <p>Let's add a new unitform: translation.</p>
          <div className='codeblock'>{ADD_TRANSLATION}</div>
          <p>By using <b>requestAnimationFrame</b> and <b>counter</b>, we can setup a simple animation loop with 60fps.</p>
          <div className='codeblock'>{TRANSLATE_TRIANGLE}</div>
          <h3>Rotation and Scalling</h3>
          <p>If you want to apply rotating and scaling before translation, you can apply the new vertex shader below</p>
          <div className='codeblock'>{ROTATING_SCALING_TRIANGLE}</div>
          <p>You don't have to understand the mathematical part right now. If you are interested, my Youtube video <a href='https://www.youtube.com/watch?v=68Qc59lb04E' target='_blank'>WebGL Study Note 02: 2D Transformation</a> can be used as a reference.</p>
          <p>We can use <b>matrix</b> to represent transformation, it can not only make code clearer, but also help you implement different order of transformation without changing the shaders.</p>
          <p>To transform a 2D point, we need a 3-by-3 matrix.</p>
          <div className='codeblock'>{MATRIX_3BY3}</div>
          <p>Now we can replace translation, scaling and angle with transformMat, please remember remove related javascript configurational code.</p>
          <div className='codeblock'>{APPLYING_MATRIX_3BY3}</div>
          <canvas className='demo-canvas' id='animateTriangleQuestion'></canvas>
          <p><b>Practice: make the triangle rotating around center point.</b></p>
          <h2 id='sec4'>Step 4: Transform 3D shapes</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='transform3DShape'></canvas>
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
