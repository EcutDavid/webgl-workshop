import React from 'react';

import 'styles/navigationBar.scss';

export default class NavigationBar extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className='NavigationBar'>
        <a className='navigator' href='#sec1'>
          <p>01</p>
          <p>2D Triangles</p>
        </a>
        <a className='navigator' href='#sec2'>
          <p>02</p>
          <p>Shaders</p>
        </a>
        <a className='navigator' href='#sec3'>
          <p>03</p>
          <p>Animations</p>
        </a>
        <a className='navigator' href='#sec4'>
          <p>04</p>
          <p>3D Cube</p>
        </a>
        <a className='navigator' href='#sec5'>
          <p>05</p>
          <p>User Interaction</p>
        </a>
        <a className='navigator' href='#sec6'>
          <p>06</p>
          <p>Next Step</p>
        </a>
      </div>
    );
  }
}
