// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider, getLibrary } from './web3';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);