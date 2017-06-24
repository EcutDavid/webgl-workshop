import React from 'react';

import 'styles/main.scss';
import CodeMirror from 'codemirror/lib/codemirror';
import Header from './Header';
import NavigationBar from './NavigationBar';

const code =
`class Matrix {
  static identity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static xRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  }

  static yRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  }

  static zRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static scaling(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1
    ];
  }

  static translation(tx, ty, tz) {
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1
    ];
  }

  static translate(m, tx, ty, tz) {
    return Matrix.multiply(m, Matrix.translation(tx, ty, tz));
  }

  static xRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.xRotation(angleInRadians));
  }

  static yRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.yRotation(angleInRadians));
  }

  static zRotate(m, angleInRadians) {
    return Matrix.multiply(m, Matrix.zRotation(angleInRadians));
  }

  static scale(m, sx, sy, sz) {
    return Matrix.multiply(m, Matrix.scaling(sx, sy, sz));
  }

  static perspective(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
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
}`;

class Main extends React.Component {
  componentDidMount() {
    CodeMirror(document.querySelector('#code'), {
      value: code,
      // lineNumbers: true,
      // htmlmixed supported
      mode: 'javascript',
      theme: 'mdn-like',
      readOnly: 'true'
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className='workshop-content'>
          <h2 id='sec1'>2D Triangles</h2>
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
