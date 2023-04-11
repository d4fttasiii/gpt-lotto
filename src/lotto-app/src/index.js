// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Web3ReactProvider, getLibrary } from './web3/web3';
import App from './App';
import './index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
);
