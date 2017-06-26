import React from 'react';

import 'styles/navigationBar.scss';
import { pageScrollTopAnimate } from 'html-utilities';

export default class NavigationBar extends React.Component {
  constructor() {
    super();
    const state = {};
    for (let i = 1; i < 7; i++) {
      state[`sec${i}Inview`] = false;
    }
    this.state = state;
  }

  componentDidMount() {
    const state = {};
    function checkNav() {
      for (let i = 1; i < 7; i++) {
        state[`sec${i}Inview`] = false;
      }
      const windowHeight = 'innerHeight' in window
        ? window.innerHeight : document.documentElement.offsetHeight;
      for (let i = 1; i < 7; i++) {
        const dom = document.querySelector(`#sec${i}`);
        const boundingClientRect = dom.getBoundingClientRect ?
          dom.getBoundingClientRect() : {};
        if (boundingClientRect.bottom === undefined) {
          boundingClientRect.bottom = windowHeight;
        }
        if (boundingClientRect.bottom - windowHeight < 0) {
          state[`sec${i - 1}Inview`] = false;
          state[`sec${i}Inview`] = true;
        }
      }
      this.setState(state);
    }
    setInterval(checkNav.bind(this), 500);
  }

  animateToSec(dsecID) {
    const newScrollTop = document.querySelector(`#sec${dsecID}`).getBoundingClientRect().top
      + document.body.scrollTop;
    pageScrollTopAnimate(newScrollTop, 1000);
  }

  render() {
    const { state } = this;
    return (
      <div className='NavigationBar'>
        <a
          className={`navigator ${state.sec1Inview ? 'inview' : ''}`}
          href='#sec1'
          onClick={this.animateToSec.bind(this, 1)}
        >
          <p>01</p>
          <p>2D Triangles</p>
        </a>
        <a
          className={`navigator ${state.sec2Inview ? 'inview' : ''}`}
          href='#sec2'
          onClick={this.animateToSec.bind(this, 2)}
        >
          <p>02</p>
          <p>Shaders</p>
        </a>
        <a
          className={`navigator ${state.sec3Inview ? 'inview' : ''}`}
          href='#sec3'
          onClick={this.animateToSec.bind(this, 3)}
        >
          <p>03</p>
          <p>Animations</p>
        </a>
        <a
          className={`navigator ${state.sec4Inview ? 'inview' : ''}`}
          href='#sec4'
          onClick={this.animateToSec.bind(this, 4)}
        >
          <p>04</p>
          <p>3D Shapes</p>
        </a>
        <a
          className={`navigator ${state.sec5Inview ? 'inview' : ''}`}
          href='#sec5'
          onClick={this.animateToSec.bind(this, 5)}
        >
          <p>05</p>
          <p>User Interactions</p>
        </a>
        <a
          className={`navigator ${state.sec6Inview ? 'inview' : ''}`}
          href='#sec6'
          onClick={this.animateToSec.bind(this, 6)}
        >
          <p>06</p>
          <p>Next Step</p>
        </a>
      </div>
    );
  }
}
