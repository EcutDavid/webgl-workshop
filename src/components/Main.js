import 'normalize.css/normalize.css'
import 'styles/App.scss'
import React from 'react'

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="notice">Hello human</div>
      </div>
    )
  }
}

AppComponent.defaultProps = {
}

export default AppComponent
