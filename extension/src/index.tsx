import React from 'react';

import ReactDOM from 'react-dom';

import { App } from './app';

if (typeof document !== 'undefined') {
  const target = document.getElementById('root');
  ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, target);
}
