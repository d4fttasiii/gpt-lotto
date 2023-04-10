// src/web3/web3.js
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injectedConnector = new InjectedConnector({ supportedChainIds: [137, 1337] });

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export { Web3ReactProvider, injectedConnector, getLibrary };
