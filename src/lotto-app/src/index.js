// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Web3 } from './web3/web3';
import { SnackBarProvider } from './contexts/SnackBarContext';
import App from './App';
import './index.css';
import 'animate.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <Web3>
    <SnackBarProvider>
      <App />
    </SnackBarProvider>
  </Web3>
);
