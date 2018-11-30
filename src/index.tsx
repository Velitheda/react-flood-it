import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Board size={14} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
