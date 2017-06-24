import React from 'react';

import 'styles/header.scss';

export default class Header extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className='Header'>
        <h1>WebGL workshop</h1>
        <p style={{ color: 'red' }}>This site is currently on building; final version will be presented on June 26</p>
        <div>TODO: add a nice picture as background</div>
      </div>
    );
  }
}
