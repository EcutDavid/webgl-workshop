import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css/normalize.css';
import 'styles/reset.scss';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';

import App from './components/Main';


// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
