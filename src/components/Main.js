import React from 'react';

import 'styles/main.scss';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <button
          className="button"
          style={{ display: 'block', margin: '30px auto' }}
        >
          Test Jenkins Github plugin
        </button>
      </div>
    );
  }
}

export default AppComponent;
