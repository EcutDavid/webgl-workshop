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
  USER_INTERACTION,
  CONFIG_3D,
  MATRIX_4BY4,
  DRAW_3D
} from '../constants/code';
import babelImg from '../images/babel.png';
import resolutionUniformImg from '../images/resolutionUniform.png';
import shadersImg from '../images/shaders.png';
import axisImg from '../images/axis.png';
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
          <p>You can check out the source code for this website in <a href='https://github.com/EcutDavid/webgl-workshop' target='_blank'>the Github repo.</a></p>
          <p>If you have any questions or suggestions, please open issues on that repo or send email to <a href='mailto:davidguandev@gmail.com'>davidguandev@gmail.com</a>.</p>
          <p>The javascript code on this website is using es2015 syntax, which is well supported by most of the browsers.</p>
          <p>You can use <a href='https://babeljs.io/repl/'>babeljs.io/repl</a> to transform the code to javascript engine friendlier.</p>
          <img src={babelImg}></img>
          <p>In real-life projects, we will integrate the code transformation into building process for sure.</p>
          <h2 id='sec1'>Step 1: Draw 2D Triangles</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='trianglesDemo'></canvas>
          <h3>WebGL context</h3>
          <p>Let's get started with HTML, to keep this workshop simple; we will put all code in a single file, <b>please do not follow this practice in real-life projects</b>.</p>
          <div className='codeblock'>{GET_STARTED}</div>
          <p>From now on, we will just work inside the script tag.</p>
          <p>Get the WebGL context from canvas element.</p>
          <div className='codeblock' id='getCanvas'>{GET_CANVAS_ES6}</div>
          <h3>Configuration</h3>
          <p>We need to compile the shaders, link the program and configure data pipeline between main memory and GPU's memory.</p>
          <div className='codeblock' id='glConfig'>{GL_CONFIGURATION_ES6}</div>
          <h3>Draw Triangles</h3>
          <div className='codeblock' id='drawTriangles'>{DRAW_TRIANGLES}</div>
          <h2 id='sec2'>Step 2: Understand Shaders</h2>
          <img src={shadersImg}></img>
          <p>To pass data to shaders, we can use <b>attributes</b>, <b>varying</b>, <b>uniforms</b> and <b>texture</b>. View <a href='https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html' target='_blank'>this page</a> if you want to know more about them.</p>
          <h3>Uniforms</h3>
          <p>In the previous example, the points are mapped to WebGL's space; we can map the space to the one that we are usually using.</p>
          <img src={axisImg}></img>
          <div>
            <p>x-axis: (-1, 1) -> (0, drawing buffer width)</p>
            <p>y-axis: (-1, 1) -> (drawing buffer height, 0)</p>
            <p>z-axis: (-1, 1) -> (0, drawing buffer depth)</p>
          </div>
          <p>Let's do it with an uniform.</p>
          <div className='codeblock'>{ADD_RESOLUTION}</div>
          <p>Same as configure data buffer for attributes, we need to change configuration for the uniform with javascript.</p>
          <div className='codeblock'>{CONFIG_RESOLUTION_UNIFORM}</div>
          <p>Now, we can modify the data buffer.</p>
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
          <p>We can use a <b>matrix</b> to represent transformation; it can not only make code clearer but also help you implement a different order of transformation without changing the shaders.</p>
          <p>To transform a 2D point, we need a 3-by-3 matrix.</p>
          <div className='codeblock'>{MATRIX_3BY3}</div>
          <p>Now we can replace translation, scaling, and angle with transformMat; please remember to remove related javascript configurational code.</p>
          <div className='codeblock'>{APPLYING_MATRIX_3BY3}</div>
          <canvas className='demo-canvas' id='animateTriangleQuestion'></canvas>
          <p><b>Practice: make the triangle rotating around the center point.</b></p>
          <h2 id='sec4'>Step 4: Transform 3D shapes</h2>
          <h3>Final result</h3>
          <canvas className='demo-canvas' id='transform3DShape'></canvas>
          <p>To support 3D shapes, we have to repalce the <b>vec2</b> in vertex shaders to <b>vec3</b>.</p>
          <div className='codeblock'>{CONFIG_3D}</div>
          <p>And we have to implement the Matrix4By4 class for 3D transform</p>
          <div className='codeblock'>{MATRIX_4BY4}</div>
          <p>Now, let's draw shapes using the new points.</p>
          <div className='codeblock'>{DRAW_3D}</div>
          <h2 id='sec5'>Step 5: Implement User Interactions</h2>
          <p>If you scroll to the top of this website, try to click the cubes, you will found that's interactive.</p>
          <p>These cubes are implemented with WebGL with two events below; please try to build some Interactions with your 3D shapes :)</p>
          <div className='codeblock'>{USER_INTERACTION}</div>
          <h2 id='sec6'>What's Next?</h2>
          <p>These two websites help me a lot as references for WebGL: <a href='https://webglfundamentals.org/' target='_blank'>WebGL Fundamentals</a> and <a href='http://learningwebgl.com/' target='_blank'>Learning WebGL</a>, check out them if you want to know more.</p>
          <p>Although this is a website for WebGL, when it comes to building 3D projects, I still recommend you use frameworks and tools like <a href='https://threejs.org/' target='_blank'>three.js</a>, <a href='https://aframe.io/' target='_blank'>A-FRAME</a>, <a href='https://facebook.github.io/react-vr/' target='_blank'>React VR</a>, they help your team deliver faster with more maintainable code.</p>
        </div>
        <NavigationBar />
        <div className='footer' />
      </div>
    );
  }
}

export default Main;
